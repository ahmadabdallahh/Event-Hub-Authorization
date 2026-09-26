// Palette lifted verbatim from src/index.css (@theme) — no invented colors:
// bg gray-900 #1f1d1b, card gray-800 #31302e, border gray-700 #4b4a47,
// text gray-100 #f4f3f1, muted gray-400 #aeaba7 / gray-500 #8a8784,
// primary-500 #ffd37c, primary-800 #fab833, primary-900 #f6ad1b.
// Email-safe: table layout, inline styles only (many clients strip <style>).
function buildOtpHtml(otp) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background-color:#1f1d1b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1f1d1b;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#31302e;border:1px solid #4b4a47;border-radius:12px;">
<tr><td style="padding:32px 32px 8px 32px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#f4f3f1;">EventHub</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#f6ad1b;letter-spacing:2px;margin-top:4px;">PASSWORD RESET</div>
</td></tr>
<tr><td style="padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#f4f3f1;">
Use this code to reset your password. It expires in <strong>10 minutes</strong>.
</td></tr>
<tr><td align="center" style="padding:8px 32px 16px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#1f1d1b;border:1px dashed #fab833;border-radius:8px;">
<tr><td style="padding:16px 40px;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:bold;letter-spacing:8px;color:#ffd37c;">${otp}</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 32px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#aeaba7;">
If you did not request this, you can safely ignore this email.
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #4b4a47;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a8784;">
EventHub
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
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
      htmlContent: buildOtpHtml(otp),
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
exports.buildOtpHtml = buildOtpHtml; // exported for preview/testing
