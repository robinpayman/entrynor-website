import azure.functions as func
import json
import logging
import aiohttp
import os
from urllib.parse import urlencode

app = func.FunctionApp()

# Get environment variables
TENANT_ID = os.getenv('EMAIL_GRAPH_TENANT_ID')
CLIENT_ID = os.getenv('EMAIL_GRAPH_CLIENT_ID')
CLIENT_SECRET = os.getenv('EMAIL_GRAPH_CLIENT_SECRET')
RECAPTCHA_SECRET = os.getenv('RECAPTCHA_SECRET_KEY')
SENDER_EMAIL = os.getenv('EMAIL_GRAPH_SENDER', 'info@entrynor.no')


async def get_graph_token():
    """Get Microsoft Graph access token using client credentials"""
    if not all([TENANT_ID, CLIENT_ID, CLIENT_SECRET]):
        raise ValueError('Missing Microsoft Graph credentials')
    
    url = f'https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token'
    
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'scope': 'https://graph.microsoft.com/.default',
        'grant_type': 'client_credentials',
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=data) as resp:
            if resp.status != 200:
                raise Exception(f'Failed to get Graph token: {resp.status}')
            result = await resp.json()
            return result['access_token']


async def verify_recaptcha(token: str) -> bool:
    """Verify reCAPTCHA v2 token"""
    if not RECAPTCHA_SECRET:
        logging.warning('RECAPTCHA_SECRET_KEY not configured, skipping verification')
        return True
    
    url = 'https://www.google.com/recaptcha/api/siteverify'
    
    data = {
        'secret': RECAPTCHA_SECRET,
        'response': token,
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as resp:
                if resp.status != 200:
                    logging.error(f'reCAPTCHA API error: {resp.status}')
                    return False
                
                result = await resp.json()
                
                if not result.get('success'):
                    logging.warning(f'reCAPTCHA verification unsuccessful: {result.get("error-codes")}')
                    return False
                
                # For v2, just check success flag
                return True
    except Exception as e:
        logging.error(f'reCAPTCHA verification error: {e}')
        return False


async def send_email_via_graph(token: str, recipient_email: str, subject: str, body: str):
    """Send email via Microsoft Graph API"""
    url = 'https://graph.microsoft.com/v1.0/me/sendMail'
    
    payload = {
        'message': {
            'subject': subject,
            'body': {
                'contentType': 'text',
                'content': body,
            },
            'toRecipients': [
                {
                    'emailAddress': {
                        'address': recipient_email,
                    },
                },
            ],
        },
    }
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, headers=headers) as resp:
            if resp.status not in [200, 202]:
                error_text = await resp.text()
                raise Exception(f'Failed to send email: {error_text}')


@app.route(route='contact-form', methods=['POST'], auth_level=func.AuthLevel.ANONYMOUS)
async def contact_form(req: func.HttpRequest) -> func.HttpResponse:
    """Handle contact form submissions"""
    
    # Set CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    # Handle preflight requests
    if req.method == 'OPTIONS':
        return func.HttpResponse('', status_code=200, headers=headers)
    
    try:
        # Parse request body
        req_body = req.get_json()
        
        name = req_body.get('name', '').strip()
        phone = req_body.get('phone', '').strip()
        email = req_body.get('email', '').strip()
        message = req_body.get('message', '').strip()
        recaptcha_token = req_body.get('recaptchaToken', '').strip()
        
        # Validate required fields
        if not all([name, phone, email, message, recaptcha_token]):
            return func.HttpResponse(
                json.dumps({'success': False, 'message': 'Missing required fields'}),
                status_code=400,
                headers=headers,
            )
        
        # Validate email format
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return func.HttpResponse(
                json.dumps({'success': False, 'message': 'Invalid email format'}),
                status_code=400,
                headers=headers,
            )
        
        # Verify reCAPTCHA
        is_human = await verify_recaptcha(recaptcha_token)
        if not is_human:
            return func.HttpResponse(
                json.dumps({'success': False, 'message': 'reCAPTCHA verification failed'}),
                status_code=403,
                headers=headers,
            )
        
        # Get Graph token
        token = await get_graph_token()
        
        # Send email to info@entrynor.no
        email_body = f"""New contact form submission:

Name: {name}
Phone: {phone}
Email: {email}

Message:
{message}

---
Sent from entrynor.no contact form"""
        
        await send_email_via_graph(
            token,
            SENDER_EMAIL,
            f'New Contact Form Submission from {name}',
            email_body,
        )
        
        # Send confirmation email to user
        confirmation_body = f"""Hi {name},

Thank you for contacting Entrynor AS. We have received your message and will get back to you soon.

Best regards,
Entrynor AS"""
        
        await send_email_via_graph(
            token,
            email,
            'We received your message',
            confirmation_body,
        )
        
        return func.HttpResponse(
            json.dumps({'success': True, 'message': 'Email sent successfully'}),
            status_code=200,
            headers=headers,
        )
    
    except Exception as e:
        logging.error(f'Contact form error: {e}')
        return func.HttpResponse(
            json.dumps({'success': False, 'message': str(e)}),
            status_code=500,
            headers=headers,
        )
