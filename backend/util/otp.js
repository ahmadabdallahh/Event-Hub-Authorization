const { randomInt, createHash, timingSafeEqual } = require('crypto');

// 6-digit numeric OTP, 10-minute life, 5 attempts, 60s resend cooldown.
// Stored as SHA-256 hashes in memory — raw codes never touch disk.
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

// email -> { hash: Buffer, expiresAt: number, attempts: number, lastSentAt: number }
const store = new Map();

function hashOtp(otp) {
  return createHash('sha256').update(String(otp)).digest();
}

// Throws { status: 429 } when called inside the resend cooldown window.
function requestOtp(email) {
  const now = Date.now();
  const prev = store.get(email);
  if (prev && now - prev.lastSentAt < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - prev.lastSentAt)) / 1000);
    const error = new Error(`Please wait ${waitSec}s before requesting a new code.`);
    error.status = 429;
    throw error;
  }
  const otp = String(randomInt(0, 1000000)).padStart(6, '0');
  store.set(email, { hash: hashOtp(otp), expiresAt: now + OTP_TTL_MS, attempts: 0, lastSentAt: now });
  return otp;
}

// Single-use: a successful verify deletes the record. Exhausted or
// expired records are deleted too, forcing a fresh /forgot-password.
function verifyOtp(email, otp) {
  const record = store.get(email);
  if (!record) {
    return { ok: false, reason: 'expired' };
  }
  if (Date.now() > record.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }
  record.attempts += 1;
  let match = false;
  try {
    match = timingSafeEqual(record.hash, hashOtp(otp ?? ''));
  } catch (error) {
    match = false;
  }
  if (!match) {
    if (record.attempts >= MAX_ATTEMPTS) {
      store.delete(email);
      return { ok: false, reason: 'locked' };
    }
    return { ok: false, reason: 'invalid', attemptsLeft: MAX_ATTEMPTS - record.attempts };
  }
  store.delete(email);
  return { ok: true };
}

exports.requestOtp = requestOtp;
exports.verifyOtp = verifyOtp;
