const { requireAuth, optionalAuth } = require('./auth');
const { requireAdmin } = require('./admin');

// This file will export middleware as the application grows
module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
};
