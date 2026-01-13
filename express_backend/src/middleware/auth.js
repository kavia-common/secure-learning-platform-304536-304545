const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isTokenBlacklisted, jwtSecret } = require('../services/authService');

function extractBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer') return null;
  return token || null;
}

// PUBLIC_INTERFACE
async function requireAuth(req, res, next) {
  /**
   * Require a valid JWT token (Authorization: Bearer ...).
   * Attaches {user, tokenPayload} to req.
   */
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ status: 'error', message: 'Missing Authorization Bearer token' });

    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ status: 'error', message: 'Token has been logged out' });
    }

    const payload = jwt.verify(token, jwtSecret());
    const user = await User.findById(payload.sub);

    if (!user) return res.status(401).json({ status: 'error', message: 'User not found' });

    req.user = user;
    req.tokenPayload = payload;
    req.token = token;
    return next();
  } catch (err) {
    // Intentionally verbose error shape for learning (stack trace will be added by global error handler too).
    return next(err);
  }
}

// PUBLIC_INTERFACE
function optionalAuth(req, res, next) {
  /**
   * Best-effort auth: if token present and valid, attach req.user.
   * Otherwise continue without failing.
   */
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();

  requireAuth(req, res, (err) => {
    if (err) return next(); // swallow
    return next();
  });
}

module.exports = {
  requireAuth,
  optionalAuth,
};
