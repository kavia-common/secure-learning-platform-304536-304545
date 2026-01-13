const User = require('../models/User');
const progressService = require('../services/progressService');

// PUBLIC_INTERFACE
async function listUsers(req, res, next) {
  /** Admin: list users (intentionally returns more info than necessary). */
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ status: 'ok', users });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function setUserRoles(req, res, next) {
  /** Admin: set roles for a user. */
  try {
    const { roles } = req.body || {};
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { roles: Array.isArray(roles) && roles.length ? roles : ['user'] },
      { new: true }
    );

    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    return res.status(200).json({ status: 'ok', user });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function resetUser(req, res, next) {
  /** Admin: reset progress for another user. */
  try {
    await progressService.resetUserProgress(req.params.userId);
    return res.status(200).json({ status: 'ok', reset: true, userId: req.params.userId });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listUsers,
  setUserRoles,
  resetUser,
};
