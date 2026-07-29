import type { APIRoute } from 'astro';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  recaptchaToken: string;
}

// Get Microsoft Graph access token
async function getGraphToken(): Promise<string> {
  const tenantId = import.meta.env.EMAIL_GRAPH_TENANT_ID;
  const clientId = import.meta.env.EMAIL_GRAPH_CLIENT_ID;
  const clientSecret = import.meta.env.EMAIL_GRAPH_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing Microsoft Graph credentials');
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }).toString(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get Graph token: ${response.statusText}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification');
    return true; // Allow if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA verification failed: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      score: number;
      action: string;
      challenge_ts: string;
      hostname: string;
    };

    // For v3, check score (0.0 - 1.0, where 1.0 is very likely legitimate)
    // We'll accept scores >= 0.5 as legitimate
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

// Send email via Microsoft Graph
async function sendEmailViaGraph(
  token: string,
  senderEmail: string,
  recipientEmail: string,
  name: string,
  phone: string,
  email: string,
  message: string
): Promise<void> {
  const emailBody = `
New contact form submission:

Name: ${name}
Phone: ${phone}
Email: ${email}

Message:
${message}

---
Sent from entrynor.no contact form
  `.trim();

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/sendMail',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject: `New Contact Form Submission from ${name}`,
          body: {
            contentType: 'text',
            content: emailBody,
          },
          toRecipients: [
            {
              emailAddress: {
                address: recipientEmail,
              },
            },
          ],
          replyToAddresses: [
            {
              emailAddress: {
                address: email,
              },
            },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = (await request.json()) as ContactFormData;

    // Validate required fields
    if (!data.name || !data.phone || !data.email || !data.message || !data.recaptchaToken) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(data.recaptchaToken);
    if (!isHuman) {
      return new Response('reCAPTCHA verification failed', { status: 403 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response('Invalid email format', { status: 400 });
    }

    // Get Microsoft Graph token
    const token = await getGraphToken();

    // Get sender email from environment
    const senderEmail = import.meta.env.EMAIL_GRAPH_SENDER;
    if (!senderEmail) {
      throw new Error('EMAIL_GRAPH_SENDER not configured');
    }

    // Send email to info@entrynor.no
    await sendEmailViaGraph(
      token,
      senderEmail,
      'info@entrynor.no',
      data.name,
      data.phone,
      data.email,
      data.message
    );

    // Also send confirmation to the user (optional)
    const confirmationBody = `
Hi ${data.name},

Thank you for contacting Entrynor AS. We have received your message and will get back to you soon.

Best regards,
Entrynor AS
    `.trim();

    await fetch(
      'https://graph.microsoft.com/v1.0/me/sendMail',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            subject: 'We received your message',
            body: {
              contentType: 'text',
              content: confirmationBody,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: data.email,
                },
              },
            ],
          },
        }),
      }
    );

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
