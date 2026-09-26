// Brevo Transactional API sender (API-key auth, no SDK needed).
// Reads BREVO_API_KEY + BREVO_SENDER_EMAIL from env. When either is
// missing, the OTP is printed to the console instead so the reset flow
// stays testable without Brevo.
async function sendOtpEmail(toEmail, otp) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'EventHub';

  if (!apiKey || !senderEmail) {
    console.log(`[DEV] OTP for ${toEmail}: ${otp} (set BREVO_API_KEY + BREVO_SENDER_EMAIL to send real email)`);
    return { sent: false, dev: true };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject: 'Your EventHub password reset code',
      htmlContent: `<p>Your password reset code is: <strong>${otp}</strong></p><p>It expires in 10 minutes. If you did not request this, ignore this email.</p>`,
      textContent: `Your EventHub password reset code is: ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error('Reset email could not be sent. Try again later.');
    error.status = 502;
    error.detail = detail;
    throw error;
  }

  return { sent: true };
}

exports.sendOtpEmail = sendOtpEmail;
