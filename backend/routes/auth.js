const express = require('express');
const { add, get } = require('../data/user');
const { createJSONToken, isValidPassword } = require('../util/auth');
const { isValidEmail, isValidText } = require('../util/validation');

const router = express.Router();

// httpOnly session cookie: not readable via document.cookie / JS (XSS-safe).
// `token` is still returned in the JSON body for backward compatibility
// with clients that send `Authorization: Bearer <token>`.
function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000, // 1h, matches createJSONToken expiresIn
    path: '/',
  });
}

router.post('/signup', async (req, res, next) => {
    const data = req.body;
    let errors = {};

    if (!isValidEmail(data.email)) {
        errors.email = 'Invalid email.';
    } else {
        try {
            const existingUser = await get(data.email);
            if (existingUser) {
                errors.email = 'Email exists already.';
            }
        } catch (error) { }
    }

    if (!isValidText(data.password, 6)) {
        errors.password = 'Invalid password. Must be at least 6 characters long.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'User signup failed due to validation errors.',
            errors,
        });
    }

    try {
        const createdUser = await add(data);
        const authToken = createJSONToken(createdUser.email);
        setAuthCookie(res, authToken);
        res
            .status(201)
            .json({ message: 'User created.', user: createdUser, token: authToken });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let user;
    try {
        user = await get(email);
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed.' });
    }

    const pwIsValid = await isValidPassword(password, user.password);
    if (!pwIsValid) {
        return res.status(422).json({
            message: 'Invalid credentials.',
            errors: { credentials: 'Invalid email or password entered.' },
        });
    }

    const token = createJSONToken(email);
    setAuthCookie(res, token);
    res.json({ token });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.json({ message: 'Logged out.' });
});

module.exports = router;
