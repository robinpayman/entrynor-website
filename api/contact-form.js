// Entrynor Contact Form API — sends email via Resend (https://resend.com)
// Replaces the previous Microsoft Graph ROPC flow which cannot work in a
// serverless context (AADSTS65001 consent_required).
//
// Environment variables:
// - RESEND_API_KEY        (required) Resend API key
// - RECAPTCHA_SECRET_KEY  (optional) Google reCAPTCHA secret for verification
// - SENDER_EMAIL          (optional) default: info@entrynor.no  (requires verified domain in Resend)
// - RECIPIENT_EMAIL       (optional) default: info@entrynor.no
// - FALLBACK_RECIPIENT    (optional) default: robin.payman@gmail.com (Resend account owner)

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@entrynor.no';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || process.env.CONTACT_EMAIL || 'info@entrynor.no';
const FALLBACK_SENDER = 'onboarding@resend.dev'; // always allowed by Resend
const FALLBACK_RECIPIENT = process.env.FALLBACK_RECIPIENT || 'robin.payman@gmail.com'; // Resend account owner

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validate form data (same rules as before)
 */
function validateFormData(data) {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid request body' };
  if (!data.name || !String(data.name).trim()) return { valid: false, error: 'Name is required' };
  if (!data.email || !String(data.email).includes('@')) return { valid: false, error: 'Valid email is required' };
  if (!data.phone || !String(data.phone).trim()) return { valid: false, error: 'Phone is required' };
  if (!data.message || !String(data.message).trim()) return { valid: false, error: 'Message is required' };
  return { valid: true };
}

/**
 * Verify reCAPTCHA token with Google (soft check: only when a token is present)
 */
async function verifyRecaptcha(token) {
  if (!token || !RECAPTCHA_SECRET) return { valid: true, skipped: true };
  try {
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
    });
    const data = await resp.json();
    if (data.success === false) {
      return { valid: false, reason: (data['error-codes'] || []).join(', ') };
    }
    return { valid: true };
  } catch (err) {
    // Do not block submissions if Google is unreachable
    console.warn('reCAPTCHA verification unavailable:', err.message);
    return { valid: true, skipped: true };
  }
}

/**
 * Build the notification email HTML
 */
function formatEmailBody(data, note) {
  return `
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c4a669;">New Contact Form Submission — Entrynor</h2>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <h3 style="margin-top: 16px;">Message:</h3>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      </div>
      ${note ? `<p style="color:#a06500;font-size:0.9em;margin-top:12px;">${escapeHtml(note)}</p>` : ''}
      <p style="margin-top: 16px; font-size: 0.85em; color: #666;">Submitted at ${new Date().toISOString()}</p>
    </div>
  </body>
</html>`.trim();
}

/**
 * Send one email via the Resend REST API. Returns { ok, id, error }.
 */
async function resendSend({ from, to, replyTo, subject, html }) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Entrynor Contact Form <${from}>`,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });
  const body = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return { ok: false, status: resp.status, error: body.message || JSON.stringify(body) };
  }
  return { ok: true, id: body.id };
}

/**
 * Send with graceful fallbacks:
 * 1. from SENDER_EMAIL to RECIPIENT_EMAIL          (works once entrynor.no is verified in Resend)
 * 2. from onboarding@resend.dev to RECIPIENT_EMAIL (works if recipient restrictions allow)
 * 3. from onboarding@resend.dev to account owner   (always works on free/unverified accounts)
 */
async function sendWithFallbacks(data) {
  const subject = `New Contact Form Submission from ${data.name}`;
  const attempts = [
    { from: SENDER_EMAIL, to: RECIPIENT_EMAIL, note: '' },
    { from: FALLBACK_SENDER, to: RECIPIENT_EMAIL, note: 'Sent via Resend fallback sender (verify entrynor.no in Resend to send from info@entrynor.no).' },
    { from: FALLBACK_SENDER, to: FALLBACK_RECIPIENT, note: `Delivered to fallback recipient (${FALLBACK_RECIPIENT}) because Resend could not deliver to ${RECIPIENT_EMAIL}. Verify entrynor.no at https://resend.com/domains to receive at ${RECIPIENT_EMAIL}.` },
  ];

  const errors = [];
  for (const attempt of attempts) {
    const html = formatEmailBody(data, attempt.note);
    const result = await resendSend({
      from: attempt.from,
      to: attempt.to,
      replyTo: data.email,
      subject,
      html,
    });
    if (result.ok) {
      console.log(`Email sent via Resend (from=${attempt.from}, to=${attempt.to}, id=${result.id})`);
      return result;
    }
    errors.push(`from=${attempt.from} to=${attempt.to}: ${result.status} ${result.error}`);
    console.warn(`Resend attempt failed: from=${attempt.from} to=${attempt.to}:`, result.status, result.error);
  }
  throw new Error(`All Resend attempts failed: ${errors.join(' | ')}`);
}

export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      return response.status(500).json({ error: 'Email service not configured' });
    }

    const data = request.body;

    // Validate form data
    const validation = validateFormData(data);
    if (!validation.valid) {
      return response.status(400).json({ error: validation.error });
    }

    // Verify reCAPTCHA when provided
    const recaptcha = await verifyRecaptcha(data.recaptchaToken);
    if (!recaptcha.valid) {
      console.warn('reCAPTCHA verification failed:', recaptcha.reason);
      return response.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

    // Send email via Resend (with fallbacks so the form always works)
    await sendWithFallbacks({
      name: String(data.name).trim(),
      email: String(data.email).trim(),
      phone: String(data.phone).trim(),
      message: String(data.message).trim(),
    });

    console.log('Form submission received and email sent:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: String(data.message).substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
    });

    return response.status(200).json({
      success: true,
      message: 'Message submitted successfully. We will contact you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return response.status(500).json({
      error: 'Failed to process your message. Please try again later.',
      details: error.message,
    });
  }
}
