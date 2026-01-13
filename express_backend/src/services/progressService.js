const Progress = require('../models/Progress');
const Submission = require('../models/Submission');
const Lab = require('../models/Lab');

// PUBLIC_INTERFACE
async function recordAttempt({
  userId,
  labId,
  correct,
  feedback,
  answer,
  hintsUsed,
  ipAddress,
  userAgent,
}) {
  /** Record a submission and update progress for a user+lab. */
  const submission = await Submission.create({
    userId,
    labId,
    correct: !!correct,
    feedback: feedback || '',
    answer: String(answer ?? ''),
    hintsUsed: Number(hintsUsed || 0),
    ipAddress: ipAddress || '',
    userAgent: userAgent || '',
  });

  const now = new Date();
  const update = {
    $inc: {
      attemptsCount: 1,
      correctAttemptsCount: correct ? 1 : 0,
      hintCount: Number(hintsUsed || 0),
    },
    $set: {
      lastAttemptAt: now,
      status: correct ? 'completed' : 'in_progress',
    },
  };

  if (correct) {
    update.$set.completedAt = now;
  }

  const progress = await Progress.findOneAndUpdate(
    { userId, labId },
    update,
    { new: true, upsert: true }
  );

  return { submission, progress };
}

// PUBLIC_INTERFACE
async function getUserProgress(userId) {
  /** Get per-lab progress list for a user. */
  return Progress.find({ userId }).populate('labId', 'title slug category difficulty estimatedMinutes');
}

// PUBLIC_INTERFACE
async function getUserSummary(userId) {
  /** Compute a progress summary for a user. */
  const [labs, progress] = await Promise.all([
    Lab.countDocuments({ isPublished: true }),
    Progress.find({ userId }),
  ]);

  const summary = {
    totalLabs: labs,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    byCategory: {},
  };

  for (const p of progress) {
    if (p.status === 'completed') summary.completed += 1;
    else if (p.status === 'in_progress') summary.inProgress += 1;
  }

  summary.notStarted = Math.max(0, summary.totalLabs - summary.completed - summary.inProgress);

  // Lightweight category breakdown (requires lab lookup for each progress doc).
  const labIds = progress.map((p) => p.labId);
  const labsById = new Map();
  const labDocs = await Lab.find({ _id: { $in: labIds } }, 'category');
  for (const l of labDocs) labsById.set(String(l._id), l);

  for (const p of progress) {
    const lab = labsById.get(String(p.labId));
    const category = lab?.category || 'general';
    if (!summary.byCategory[category]) summary.byCategory[category] = { completed: 0, inProgress: 0 };

    if (p.status === 'completed') summary.byCategory[category].completed += 1;
    if (p.status === 'in_progress') summary.byCategory[category].inProgress += 1;
  }

  return summary;
}

// PUBLIC_INTERFACE
async function getLeaderboard(limit = 10) {
  /** Leaderboard by completed count (simple aggregation). */
  const rows = await Progress.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$userId', completed: { $sum: 1 } } },
    { $sort: { completed: -1 } },
    { $limit: Number(limit) || 10 },
  ]);

  return rows;
}

// PUBLIC_INTERFACE
async function resetUserProgress(userId) {
  /** Reset all progress/submissions for a user. */
  await Promise.all([
    Progress.deleteMany({ userId }),
    Submission.deleteMany({ userId }),
  ]);

  return true;
}

module.exports = {
  recordAttempt,
  getUserProgress,
  getUserSummary,
  getLeaderboard,
  resetUserProgress,
};
