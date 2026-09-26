const { sign, verify } = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const { NotAuthError } = require('./errors');

// In production set JWT_SECRET via env (Fly secret). Dev fallback kept local-only.
const KEY = process.env.JWT_SECRET || 'supersecret';

function createJSONToken(email) {
  return sign({ email }, KEY, { expiresIn: '1h' });
}

function validateJSONToken(token) {
  return verify(token, KEY);
}

// Short-lived token that authorizes ONE password reset. Carries a
// purpose claim so it can never be mistaken for a session token.
function createPasswordResetToken(email) {
  return sign({ email, purpose: 'password-reset' }, KEY, { expiresIn: '15m' });
}

function validatePasswordResetToken(token) {
  const payload = verify(token, KEY);
  if (!payload || payload.purpose !== 'password-reset') {
    throw new Error('Invalid reset token.');
  }
  return payload;
}

function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
}

function checkAuthMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  // Prefer the httpOnly cookie; fall back to `Authorization: Bearer <token>`
  // so clients that still send the header keep working.
  let authToken = req.cookies && req.cookies.token;
  if (!authToken) {
    if (!req.headers.authorization) {
      console.log('NOT AUTH. AUTH HEADER MISSING.');
      return next(new NotAuthError('Not authenticated.'));
    }
    const authFragments = req.headers.authorization.split(' ');

    if (authFragments.length !== 2) {
      console.log('NOT AUTH. AUTH HEADER INVALID.');
      return next(new NotAuthError('Not authenticated.'));
    }
    authToken = authFragments[1];
  }
  try {
    const validatedToken = validateJSONToken(authToken);
    // Reset tokens are not session tokens — refuse them here.
    if (validatedToken.purpose) {
      console.log('NOT AUTH. NON-SESSION TOKEN.');
      return next(new NotAuthError('Not authenticated.'));
    }
    req.token = validatedToken;
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return next(new NotAuthError('Not authenticated.'));
  }
  next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.createPasswordResetToken = createPasswordResetToken;
exports.validatePasswordResetToken = validatePasswordResetToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
