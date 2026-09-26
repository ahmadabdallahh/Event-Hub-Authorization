const express = require('express');
const { add, get, updatePassword } = require('../data/user');
const { createJSONToken, isValidPassword, checkAuth, createPasswordResetToken, validatePasswordResetToken } = require('../util/auth');
const { requestOtp, verifyOtp } = require('../util/otp');
const { sendOtpEmail } = require('../util/mailer');
const { isValidEmail, isValidText } = require('../util/validation');

const router = express.Router();

// httpOnly session cookie: not readable via document.cookie / JS (XSS-safe).
// `token` is still returned in the JSON body for backward compatibility
// with clients that send `Authorization: Bearer <token>`.
function setAuthCookie(res, token) {
  // Production serves cross-site (Vercel frontend → Fly backend), which
  // requires SameSite=None + Secure. Local dev stays Lax (no HTTPS).
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
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

// Session check for the frontend nav (reads the httpOnly cookie via checkAuth).
router.get('/me', checkAuth, (req, res) => {
    res.json({ email: req.token.email });
});

// Step 1 — request a reset code. Always returns the same 200 response so
// callers cannot probe which emails are registered (resend cooldowns and
// unknown emails are indistinguishable from the outside).
router.post('/forgot-password', async (req, res, next) => {
    const email = req.body && req.body.email;
    if (!isValidEmail(email)) {
        return res.status(422).json({
            message: 'Invalid email.',
            errors: { email: 'Invalid email.' },
        });
    }

    const genericReply = () =>
        res.json({ message: 'If an account with that email exists, a reset code has been sent.' });

    let user;
    try {
        user = await get(email);
    } catch (error) {
        return genericReply();
    }
    if (!user) {
        return genericReply();
    }

    try {
        const otp = requestOtp(email);
        await sendOtpEmail(email, otp);
        return genericReply();
    } catch (error) {
        if (error.status === 429) {
            return genericReply();
        }
        next(error);
    }
});

// Step 2 — verify the code. Burns the OTP and returns a short-lived
// resetToken that authorizes step 3.
router.post('/verify-otp', (req, res) => {
    const email = req.body && req.body.email;
    const otp = req.body && req.body.otp;
    if (!isValidEmail(email) || !otp) {
        return res.status(422).json({ message: 'Email and code are required.' });
    }

    const result = verifyOtp(email, String(otp));
    if (!result.ok) {
        const messages = {
            expired: 'Code expired. Request a new one.',
            invalid: 'Invalid code.',
            locked: 'Too many attempts. Request a new code.',
        };
        const status = result.reason === 'expired' ? 410 : 422;
        const body = { message: messages[result.reason] };
        if (result.attemptsLeft !== undefined) {
            body.attemptsLeft = result.attemptsLeft;
        }
        return res.status(status).json(body);
    }

    const resetToken = createPasswordResetToken(email);
    res.json({ message: 'Code verified.', resetToken });
});

// Step 3 — set the new password. The resetToken (not the OTP) is the
// credential here, so a verified code cannot be replayed.
router.post('/reset-password', async (req, res) => {
    const resetToken = req.body && req.body.resetToken;
    const newPassword = req.body && req.body.newPassword;

    let payload;
    try {
        payload = validatePasswordResetToken(resetToken);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired reset token.' });
    }

    if (!isValidText(newPassword, 6)) {
        return res.status(422).json({
            message: 'Invalid password.',
            errors: { password: 'Invalid password. Must be at least 6 characters long.' },
        });
    }

    try {
        await updatePassword(payload.email, newPassword);
    } catch (error) {
        return res.status(404).json({ message: 'Account not found.' });
    }
    res.json({ message: 'Password has been reset. You can now log in.' });
});

module.exports = router;
