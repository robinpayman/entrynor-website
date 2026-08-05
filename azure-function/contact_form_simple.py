#!/usr/bin/env python3
"""
Simple Entrynor Contact Form Server
Minimal HTTP server with no external dependencies
Uses only standard library modules
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import os
import sys

class ContactFormHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle form submissions"""
        if self.path != '/api/contact-form':
            self.send_error(404)
            return

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)

            # Validate fields
            name = data.get('name', '').strip()
            phone = data.get('phone', '').strip()
            email = data.get('email', '').strip()
            message = data.get('message', '').strip()

            if not all([name, phone, email, message]):
                self.send_json_response({'success': False, 'message': 'Missing required fields'}, 400)
                return

            # Log the submission (since we can't send email without dependencies)
            print(f"\n{'='*60}")
            print(f"Contact Form Submission from {name}")
            print(f"{'='*60}")
            print(f"Email: {email}")
            print(f"Phone: {phone}")
            print(f"Message: {message}")
            print(f"{'='*60}\n")

            # Return success
            self.send_json_response(
                {'success': True, 'message': 'Submission received'},
                200
            )

        except json.JSONDecodeError:
            self.send_json_response({'success': False, 'message': 'Invalid JSON'}, 400)
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            self.send_json_response({'success': False, 'message': 'Server error'}, 500)

    def do_GET(self):
        """Handle health check"""
        if self.path == '/health':
            self.send_json_response({'status': 'ok'}, 200)
        else:
            self.send_error(404)

    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    PORT = int(os.getenv('PORT', 5000))
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, ContactFormHandler)
    print(f"✓ Contact Form Server running on port {PORT}")
    print(f"✓ Endpoint: http://0.0.0.0:{PORT}/api/contact-form")
    print(f"✓ Health check: http://0.0.0.0:{PORT}/health")
    httpd.serve_forever()
