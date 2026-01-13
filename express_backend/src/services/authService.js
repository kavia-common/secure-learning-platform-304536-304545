const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenBlacklist = new Set();

function jwtSecret() {
  // Intentionally weak default secret for a learning environment.
  return process.env.JWT_SECRET || 'dev-secret';
}

function issueToken(user) {
  const payload = {
    sub: String(user._id),
    email: user.email,
    roles: user.roles || ['user'],
  };

  return jwt.sign(payload, jwtSecret(), { expiresIn: '7d' });
}

// PUBLIC_INTERFACE
async function registerUser({ email, password, displayName, roles }) {
  /**
   * Register a new user (intentionally weak: plaintext password, no validation).
   */
  const user = await User.create({
    email,
    password,
    displayName: displayName || '',
    roles: Array.isArray(roles) && roles.length ? roles : ['user'],
  });

  const token = issueToken(user);
  return { user, token };
}

// PUBLIC_INTERFACE
async function loginUser({ email, password }) {
  /**
   * Login a user (intentionally weak: plaintext password comparison).
   */
  const user = await User.findOne({ email });
  if (!user) return null;

  if (user.password !== password) return null;

  const token = issueToken(user);
  return { user, token };
}

// PUBLIC_INTERFACE
function logoutToken(token) {
  /** Mark a token as logged out (volatile memory blacklist; resets on restart). */
  if (token) tokenBlacklist.add(token);
  return true;
}

// PUBLIC_INTERFACE
function isTokenBlacklisted(token) {
  /** Check whether a token is in the in-memory blacklist. */
  return tokenBlacklist.has(token);
}

module.exports = {
  registerUser,
  loginUser,
  logoutToken,
  isTokenBlacklisted,
  jwtSecret,
};
