const progressService = require('../services/progressService');

// PUBLIC_INTERFACE
async function myProgress(req, res, next) {
  /** Get current user's progress entries. */
  try {
    const progress = await progressService.getUserProgress(req.user._id);
    return res.status(200).json({ status: 'ok', progress });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function mySummary(req, res, next) {
  /** Get current user's progress summary. */
  try {
    const summary = await progressService.getUserSummary(req.user._id);
    return res.status(200).json({ status: 'ok', summary });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function leaderboard(req, res, next) {
  /** Get leaderboard by completed labs. */
  try {
    const limit = Number(req.query.limit || 10);
    const leaderboardRows = await progressService.getLeaderboard(limit);
    return res.status(200).json({ status: 'ok', leaderboard: leaderboardRows });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function resetMyProgress(req, res, next) {
  /** Reset current user's progress and submissions. */
  try {
    await progressService.resetUserProgress(req.user._id);
    return res.status(200).json({ status: 'ok', reset: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  myProgress,
  mySummary,
  leaderboard,
  resetMyProgress,
};
