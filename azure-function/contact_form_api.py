#!/usr/bin/env python3
"""
Entrynor Contact Form API
Standalone Flask application for handling contact form submissions
Sends emails via Microsoft Graph API and validates reCAPTCHA tokens
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import aiohttp
import asyncio
import json
import logging
import os
import re

app = Flask(__name__)
CORS(app, origins=["https://minor-mercury.vercel.app", "https://entrynor.no", "http://localhost:3000"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
                text = await resp.text()
                logger.error(f'Failed to get Graph token: {resp.status} - {text}')
                raise Exception(f'Failed to get Graph token: {resp.status}')
            result = await resp.json()
            return result['access_token']


async def verify_recaptcha(token: str) -> bool:
    """Verify reCAPTCHA v2 token"""
    if not RECAPTCHA_SECRET:
        logger.warning('RECAPTCHA_SECRET_KEY not configured, skipping verification')
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
                    logger.error(f'reCAPTCHA API error: {resp.status}')
                    return False
                
                result = await resp.json()
                
                if not result.get('success'):
                    logger.warning(f'reCAPTCHA verification unsuccessful: {result.get("error-codes")}')
                    return False
                
                return True
    except Exception as e:
        logger.error(f'reCAPTCHA verification error: {e}')
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
                logger.error(f'Failed to send email: {resp.status} - {error_text}')
                raise Exception(f'Failed to send email: {error_text}')


async def process_form_submission(data):
    """Process form submission asynchronously"""
    name = data.get('name', '').strip()
    phone = data.get('phone', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()
    recaptcha_token = data.get('recaptchaToken', '').strip()
    
    # Validate required fields
    if not all([name, phone, email, message, recaptcha_token]):
        return {'success': False, 'message': 'Missing required fields'}, 400
    
    # Validate email format
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        return {'success': False, 'message': 'Invalid email format'}, 400
    
    # Verify reCAPTCHA
    is_human = await verify_recaptcha(recaptcha_token)
    if not is_human:
        return {'success': False, 'message': 'reCAPTCHA verification failed'}, 403
    
    try:
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
        
        logger.info(f'Contact form submitted successfully by {name} ({email})')
        return {'success': True, 'message': 'Email sent successfully'}, 200
    
    except Exception as e:
        logger.error(f'Contact form error: {e}')
        return {'success': False, 'message': str(e)}, 500


@app.route('/api/contact-form', methods=['POST', 'OPTIONS'])
def contact_form():
    """Handle contact form submissions"""
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No JSON data provided'}), 400
        
        # Process async
        result, status_code = asyncio.run(process_form_submission(data))
        return jsonify(result), status_code
    
    except Exception as e:
        logger.error(f'Request processing error: {e}')
        return jsonify({'success': False, 'message': 'Server error'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
