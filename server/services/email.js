const { Resend } = require('resend');

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.EMAIL_FROM || 'no-reply@localdevhub.example';

let resendClient = null;
if (resendApiKey) {
  try {
    resendClient = new Resend(resendApiKey);
  } catch (err) {
    console.error('Failed to init Resend client:', err.message);
  }
}

async function sendEmail({ to, subject, html }) {
  if (!resendClient) {
    console.warn('Resend not configured. Skipping email send.');
    return { skipped: true };
  }
  try {
    const data = await resendClient.emails.send({ from: resendFrom, to, subject, html });
    return { ok: true, id: data?.id };
  } catch (error) {
    console.error('Resend send error:', error?.message || error);
    return { ok: false, error: error?.message || 'Unknown error' };
  }
}

module.exports = { sendEmail };


