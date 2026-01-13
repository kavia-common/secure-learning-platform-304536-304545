const Lab = require('../models/Lab');
const Hint = require('../models/Hint');

function sanitizeLabForClient(lab) {
  // Hide solution check details from clients.
  const obj = lab.toObject({ virtuals: false });
  delete obj.solutionCheck;
  return obj;
}

function evaluateSolution(solutionCheck, answer) {
  const check = solutionCheck || { type: 'exact', value: '' };
  const submitted = String(answer ?? '');

  if (check.type === 'contains') {
    return submitted.includes(String(check.value ?? ''));
  }

  if (check.type === 'regex') {
    // Intentionally dangerous-ish: regex compilation from DB content (learning sandbox).
    const re = new RegExp(String(check.value ?? ''), 'i');
    return re.test(submitted);
  }

  // default: exact match
  return submitted === String(check.value ?? '');
}

// PUBLIC_INTERFACE
async function listLabs() {
  /** Return published labs for catalog. */
  const labs = await Lab.find({ isPublished: true }).sort({ createdAt: -1 });
  return labs.map(sanitizeLabForClient);
}

// PUBLIC_INTERFACE
async function getLabById(labId) {
  /** Return a single lab detail (without solution info). */
  const lab = await Lab.findById(labId);
  if (!lab) return null;
  return sanitizeLabForClient(lab);
}

// PUBLIC_INTERFACE
async function getLabBySlug(slug) {
  /** Convenience lookup by slug. */
  const lab = await Lab.findOne({ slug });
  if (!lab) return null;
  return sanitizeLabForClient(lab);
}

// PUBLIC_INTERFACE
async function getHintsForLab(labId) {
  /** Return ordered hints for a lab. */
  return Hint.find({ labId }).sort({ order: 1, createdAt: 1 });
}

// PUBLIC_INTERFACE
async function createLab(payload) {
  /** Admin: Create a lab. */
  const lab = await Lab.create(payload);
  return sanitizeLabForClient(lab);
}

// PUBLIC_INTERFACE
async function updateLab(labId, payload) {
  /** Admin: Update a lab. */
  const lab = await Lab.findByIdAndUpdate(labId, payload, { new: true });
  if (!lab) return null;
  return sanitizeLabForClient(lab);
}

// PUBLIC_INTERFACE
async function deleteLab(labId) {
  /** Admin: Delete a lab and its hints. */
  const lab = await Lab.findByIdAndDelete(labId);
  if (!lab) return false;
  await Hint.deleteMany({ labId });
  return true;
}

// PUBLIC_INTERFACE
async function checkSolution(labId, answer) {
  /** Evaluate a submitted solution. Returns {correct, feedback}. */
  const lab = await Lab.findById(labId);
  if (!lab) return null;

  const correct = evaluateSolution(lab.solutionCheck, answer);
  const feedback = correct
    ? (lab.solutionCheck?.successMessage || 'Correct!')
    : (lab.solutionCheck?.failureMessage || 'Not quite. Try again.');

  return { correct, feedback };
}

module.exports = {
  listLabs,
  getLabById,
  getLabBySlug,
  getHintsForLab,
  createLab,
  updateLab,
  deleteLab,
  checkSolution,
};
