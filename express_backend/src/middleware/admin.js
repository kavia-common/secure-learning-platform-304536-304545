// PUBLIC_INTERFACE
function requireAdmin(req, res, next) {
  /**
   * Require that req.user has an admin role.
   * Assumes requireAuth already ran.
   */
  const roles = req.user?.roles || [];
  const isAdmin = roles.includes('admin') || roles.includes('ADMIN');

  if (!isAdmin) {
    return res.status(403).json({ status: 'error', message: 'Admin privileges required' });
  }

  return next();
}

module.exports = {
  requireAdmin,
};
