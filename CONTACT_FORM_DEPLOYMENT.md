# Entrynor Contact Form API Deployment

## Status
✅ **Ready to Deploy** - Flask-based contact form API for entrynor.no

## Files Uploaded to Server
The following files have already been uploaded to the Azure VM:
- `/home/atawarp/entrynor-contact-api/contact_form_api.py` - Flask API
- `/home/atawarp/entrynor-contact-api/requirements.txt` - Python dependencies

## Prerequisites
You need the **Azure AD Client Secret** for:
- Client ID: `831d1ba6-4929-4d89-9fb9-01ea3033e13e`
- Tenant ID: `b3a4640e-1e58-4947-a114-09fdc17ec7ea`

This secret was created in Azure Portal when you set up the Graph API credentials.

## Deployment Instructions

### Step 1: Find Your Client Secret
The Client Secret should be in:
1. **Azure Portal** → Azure AD → App registrations → "entrynor-contact-api" → Certificates & secrets → Client secrets
2. **Or** stored in your password manager / credentials file

### Step 2: Run the Deployment Script
```bash
cd /Users/rp/entrynor-website/minor-mercury/azure-function
./deploy.sh
```

When prompted, paste your Azure AD Client Secret (it will not echo on screen).

### Step 3: Wait for Deployment
The script will:
1. ✅ Create `.env` file with all credentials
2. ✅ Install Python dependencies (Flask, CORS, aiohttp, gunicorn)
3. ✅ Validate the API module
4. ✅ Create systemd service (`entrynor-contact-api`)
5. ✅ Start the service

### Step 4: Verify Deployment
```bash
# Check service status
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo systemctl status entrynor-contact-api"

# Check logs
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo journalctl -u entrynor-contact-api -f"

# Test health endpoint
curl https://ata-domain.tempurl.host:8000/health
```

## API Endpoints

### POST /api/contact-form
Handles contact form submissions

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+47 12345678",
  "email": "john@example.com",
  "message": "Your message here",
  "recaptchaToken": "token-from-google"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## Configuration

The API uses these environment variables (set in `.env`):
- `EMAIL_GRAPH_TENANT_ID` - Azure AD Tenant ID
- `EMAIL_GRAPH_CLIENT_ID` - Azure AD Application ID
- `EMAIL_GRAPH_CLIENT_SECRET` - Azure AD Client Secret (sensitive!)
- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA v2 secret key
- `EMAIL_GRAPH_SENDER` - Email address to send from (info@entrynor.no)
- `FLASK_ENV` - Environment (production)

## Updating Website URL

Once deployed, update the website to use the API:

### Option A: Direct HTTPS (if certificate is set up)
```
https://ata-domain.tempurl.host/api/contact-form
```

### Option B: Via Reverse Proxy (recommended)
Set up nginx to forward:
```
https://api.entrynor.no/contact-form → http://127.0.0.1:5000/api/contact-form
```

Then update the form URL to use `https://api.entrynor.no/contact-form`

## Features

✅ **Microsoft Graph Integration** - Sends emails via Office 365
✅ **reCAPTCHA v2 Validation** - Prevents spam
✅ **CORS Support** - Allows requests from entrynor.no
✅ **Async Email Sending** - Non-blocking operations
✅ **Error Handling** - Comprehensive logging
✅ **Auto-Restart** - Systemd service with auto-restart
✅ **Health Check** - `/health` endpoint for monitoring

## Troubleshooting

### Service won't start
```bash
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo journalctl -u entrynor-contact-api -n 50"
```

### Missing credentials
Verify `.env` file exists:
```bash
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "cat /home/atawarp/entrynor-contact-api/.env"
```

### Port already in use
Change port in service file from 5000 to another port (5001, 5002, etc.)

### Emails not sending
Check Microsoft Graph credentials and ensure:
1. Client ID is correct
2. Client Secret is valid (hasn't expired)
3. Application has Mail.Send permissions in Azure AD

## Monitoring

### View logs
```bash
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo journalctl -u entrynor-contact-api -f"
```

### Restart service
```bash
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo systemctl restart entrynor-contact-api"
```

### Stop service
```bash
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo systemctl stop entrynor-contact-api"
```

## Next Steps

1. **Run deployment script** with your Client Secret
2. **Test the API** by submitting a form on https://minor-mercury.vercel.app/en/
3. **Monitor logs** for any errors
4. **Set up reverse proxy** (nginx) for a clean API URL
5. **Update DNS** if you want to use `api.entrynor.no` domain
