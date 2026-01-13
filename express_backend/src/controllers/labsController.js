const labsService = require('../services/labsService');
const progressService = require('../services/progressService');

// PUBLIC_INTERFACE
async function listLabs(req, res, next) {
  /** List labs for the catalog. */
  try {
    const labs = await labsService.listLabs();
    return res.status(200).json({ status: 'ok', labs });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function getLab(req, res, next) {
  /** Get lab details by id (Mongo ObjectId). */
  try {
    const lab = await labsService.getLabById(req.params.labId);
    if (!lab) return res.status(404).json({ status: 'error', message: 'Lab not found' });
    return res.status(200).json({ status: 'ok', lab });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function getHints(req, res, next) {
  /** Return hints for a lab. */
  try {
    const hints = await labsService.getHintsForLab(req.params.labId);
    return res.status(200).json({ status: 'ok', hints });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function submitSolution(req, res, next) {
  /**
   * Submit a solution attempt for server-side checking.
   * Records a Submission and updates Progress.
   */
  try {
    const { answer, hintsUsed } = req.body || {};
    const result = await labsService.checkSolution(req.params.labId, answer);

    if (!result) return res.status(404).json({ status: 'error', message: 'Lab not found' });

    const { submission, progress } = await progressService.recordAttempt({
      userId: req.user._id,
      labId: req.params.labId,
      correct: result.correct,
      feedback: result.feedback,
      answer,
      hintsUsed,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
    });

    return res.status(200).json({
      status: 'ok',
      correct: result.correct,
      feedback: result.feedback,
      submissionId: submission._id,
      progress,
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function createLab(req, res, next) {
  /** Admin: Create a lab. */
  try {
    const lab = await labsService.createLab(req.body || {});
    return res.status(201).json({ status: 'ok', lab });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function updateLab(req, res, next) {
  /** Admin: Update a lab. */
  try {
    const lab = await labsService.updateLab(req.params.labId, req.body || {});
    if (!lab) return res.status(404).json({ status: 'error', message: 'Lab not found' });
    return res.status(200).json({ status: 'ok', lab });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function deleteLab(req, res, next) {
  /** Admin: Delete a lab. */
  try {
    const ok = await labsService.deleteLab(req.params.labId);
    if (!ok) return res.status(404).json({ status: 'error', message: 'Lab not found' });
    return res.status(200).json({ status: 'ok', deleted: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listLabs,
  getLab,
  getHints,
  submitSolution,
  createLab,
  updateLab,
  deleteLab,
};
