// Environment variables
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@entrynor.no';
const ENTRYNOR_INFO_EMAIL = 'info@entrynor.no';
const ENTRYNOR_INFO_PASSWORD = process.env.ENTRYNOR_INFO_PASSWORD || '';
const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID || '';
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID || '';
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET || '';

let cachedToken = null;

/**
 * Get Microsoft Graph access token using Resource Owner Password Credentials flow
 */
async function getGraphToken() {
  const now = Date.now();
  
  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: AZURE_CLIENT_ID,
          client_secret: AZURE_CLIENT_SECRET,
          username: ENTRYNOR_INFO_EMAIL,
          password: ENTRYNOR_INFO_PASSWORD,
          grant_type: 'password',
          scope: 'https://graph.microsoft.com/.default',
        }).toString(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Token request failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error('Microsoft Graph token error:', error);
    throw error;
  }
}

/**
 * Send email using Microsoft Graph API as info@entrynor.no
 */
async function sendEmail(subject, htmlBody, toEmail) {
  try {
    const token = await getGraphToken();

    const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject,
          body: {
            contentType: 'HTML',
            content: htmlBody,
          },
          toRecipients: [
            {
              emailAddress: {
                address: toEmail,
              },
            },
          ],
          from: {
            emailAddress: {
              address: ENTRYNOR_INFO_EMAIL,
              name: 'Entrynor Contact Form',
            },
          },
        },
        saveToSentItems: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Email send failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    console.log('Email sent successfully from', ENTRYNOR_INFO_EMAIL);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

/**
 * Format contact form data as HTML email
 */
function formatEmailBody(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c4a669;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-weight: bold; width: 120px;">Name:</td>
          <td style="padding: 12px;">${escapeHtml(data.name)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-weight: bold;">Email:</td>
          <td style="padding: 12px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-weight: bold;">Phone:</td>
          <td style="padding: 12px;"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; vertical-align: top;">Message:</td>
          <td style="padding: 12px;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        This email was sent from the Entrynor contact form.
      </p>
    </div>
  `;
}

/**
 * Basic HTML escaping
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate form data
 */
function validateFormData(data) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    return { valid: false, error: 'Valid email is required' };
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    return { valid: false, error: 'Phone is required' };
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }
  return { valid: true };
}

/**
 * Main handler
 */
export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = request.body;

    // Validate form data
    const validation = validateFormData(data);
    if (!validation.valid) {
      return response.status(400).json({ error: validation.error });
    }

    // Send email via Microsoft Graph
    const emailBody = formatEmailBody(data);
    await sendEmail('New Contact Form Submission from Entrynor', emailBody, CONTACT_EMAIL);

    // Log form submission for debugging
    console.log('Form submission received and email sent:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message.substring(0, 50) + '...',
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
