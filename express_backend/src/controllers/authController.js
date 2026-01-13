const { registerUser, loginUser, logoutToken } = require('../services/authService');

// PUBLIC_INTERFACE
async function register(req, res, next) {
  /** Register endpoint. Intentionally weak validation. */
  try {
    const { email, password, displayName, roles } = req.body || {};
    const result = await registerUser({ email, password, displayName, roles });

    return res.status(201).json({
      status: 'ok',
      token: result.token,
      user: {
        id: result.user._id,
        email: result.user.email,
        displayName: result.user.displayName,
        roles: result.user.roles,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function login(req, res, next) {
  /** Login endpoint. Intentionally weak password handling. */
  try {
    const { email, password } = req.body || {};
    const result = await loginUser({ email, password });

    if (!result) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    return res.status(200).json({
      status: 'ok',
      token: result.token,
      user: {
        id: result.user._id,
        email: result.user.email,
        displayName: result.user.displayName,
        roles: result.user.roles,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function logout(req, res, next) {
  /** Logout endpoint: blacklists current token (volatile, resets on server restart). */
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

    logoutToken(token);

    return res.status(200).json({
      status: 'ok',
      message: 'Logged out (token blacklisted in memory)',
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function me(req, res) {
  /** Return current authenticated user. */
  return res.status(200).json({
    status: 'ok',
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
      roles: req.user.roles,
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
