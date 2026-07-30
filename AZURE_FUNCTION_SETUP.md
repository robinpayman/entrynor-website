# Azure Function Setup - Complete Summary

## Overview

The contact form for the Entrynor website now uses a **serverless Azure Function** to handle form submissions and send emails via Office 365. This allows the static website to have dynamic form functionality.

## What Was Set Up

### 1. Azure Function Code ✅
- **Location**: `/azure-function/contact-form/function_app.py`
- **Language**: Python 3.11
- **Runtime**: Azure Functions v4
- **Type**: HTTP-triggered (POST, OPTIONS)
- **Endpoint**: `/api/contact-form`

### 2. Function Features ✅
The function:
- Receives contact form submissions (name, phone, email, message, reCAPTCHA token)
- Validates input fields
- Verifies reCAPTCHA v2 token with Google's API
- Authenticates with Microsoft Graph API using Azure AD
- Sends email to `info@entrynor.no` with submission details
- Sends confirmation email to the user
- Returns JSON response (success/error)
- Handles CORS for browser requests

### 3. Configuration Files Created ✅

**Function Configuration:**
- `azure-function/contact-form/function_app.py` - Main implementation
- `azure-function/contact-form/function.json` - Binding configuration
- `azure-function/requirements.txt` - Python dependencies

**Development Setup:**
- `azure-function/local.settings.json` - Local environment variables
- `azure-function/.gitignore` - Git exclusions for Python/Azure

**Documentation:**
- `azure-function/README.md` - Complete deployment guide
- `AZURE_FUNCTION_SETUP.md` - This summary

### 4. Website Integration ✅

**Contact Form Component:**
- Updated `/src/components/ContactFormI18n.astro`
- Form action set to: `import.meta.env.PUBLIC_AZURE_FUNCTION_URL`
- Falls back to: `https://entrynor-contact.azurewebsites.net/api/contact-form`
- Includes reCAPTCHA v2 integration

**Environment Configuration:**
- Added `PUBLIC_AZURE_FUNCTION_URL` to `.env.example`
- Added `PUBLIC_AZURE_FUNCTION_URL` to `.env.local` (with placeholder value)

## Next Steps: Deploy to Azure

### Step 1: Install Prerequisites
```bash
# macOS
brew install azure-cli
brew install azure-functions-core-tools@4

# Verify installation
az --version
func --version
```

### Step 2: Prepare Local Testing
```bash
cd azure-function

# Install Python dependencies
pip install -r requirements.txt

# Update local.settings.json with actual client secret
# Get from Azure Key Vault: tt-secrets-vault/EntrynorContactFormClientSecret
```

### Step 3: Test Locally
```bash
# Start the local function runtime
func start

# In another terminal, test the endpoint
curl -X POST http://localhost:7071/api/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+47 123 45 678",
    "email": "test@example.com",
    "message": "Test message",
    "recaptchaToken": "valid-token"
  }'
```

### Step 4: Create Azure Function App
```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name entrynor-rg --location westeurope

# Create storage account (if needed)
az storage account create \
  --name entrynorstore \
  --resource-group entrynor-rg \
  --location westeurope

# Create Function App (Python 3.11, Linux)
az functionapp create \
  --resource-group entrynor-rg \
  --consumption-plan-location westeurope \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4 \
  --name entrynor-contact \
  --storage-account entrynorstore \
  --os-type Linux
```

### Step 5: Configure Environment Variables

**Option A: Via Azure Portal**
1. Navigate to: Function App → Settings → Environment Variables
2. Add each variable from `local.settings.json`

**Option B: Via Azure CLI**
```bash
# Set individual variables
az functionapp config appsettings set \
  --name entrynor-contact \
  --resource-group entrynor-rg \
  --settings \
    EMAIL_GRAPH_TENANT_ID="b3a4640e-1e58-4947-a114-09fdc17ec7ea" \
    EMAIL_GRAPH_CLIENT_ID="831d1ba6-4929-4d89-9fb9-01ea3033e13e" \
    EMAIL_GRAPH_CLIENT_SECRET="@Microsoft.KeyVault(SecretUri=https://tt-secrets-vault.vault.azure.net/secrets/EntrynorContactFormClientSecret/)" \
    RECAPTCHA_SECRET_KEY="6Ler10QnAAAAANGBh8fCRSZRWNsQh9aI5UNeTOGi" \
    EMAIL_GRAPH_SENDER="info@entrynor.no"
```

### Step 6: Deploy Function Code
```bash
cd azure-function

# Deploy from local directory
func azure functionapp publish entrynor-contact

# Or deploy from GitHub (recommended for production)
# Setup GitHub Actions or deployment slot
```

### Step 7: Get Function URL
After deployment, the function will be available at:
```
https://entrynor-contact.azurewebsites.net/api/contact-form
```

### Step 8: Update Website Configuration
```bash
# Update .env.local with actual function URL
PUBLIC_AZURE_FUNCTION_URL=https://entrynor-contact.azurewebsites.net/api/contact-form
```

### Step 9: Configure CORS (if needed)
Function already handles CORS in code, but you can restrict it:

**Via Azure Portal:**
1. Function App → CORS
2. Add allowed origins:
   - `https://entrynor.no`
   - `https://www.entrynor.no`

**Via Azure CLI:**
```bash
az functionapp cors add \
  --resource-group entrynor-rg \
  --name entrynor-contact \
  --allowed-origins https://entrynor.no https://www.entrynor.no
```

### Step 10: Test End-to-End
1. Visit `https://entrynor.no/no/` (or local dev)
2. Fill out contact form
3. Submit
4. Check if:
   - Email received at `info@entrynor.no`
   - Confirmation email received at form email
   - Button shows "Message Sent" for 3 seconds
   - No console errors

## Credentials & References

**Tenant & App Registration:**
- Tenant ID: `b3a4640e-1e58-4947-a114-09fdc17ec7ea`
- Client ID: `831d1ba6-4929-4d89-9fb9-01ea3033e13e`
- Client Secret: Stored in `tt-secrets-vault/EntrynorContactFormClientSecret`

**reCAPTCHA v2:**
- Site Key: `6Ler10QnAAAAAHPMsiNc97HAUkoLyOx9Bzm594Db`
- Secret Key: `6Ler10QnAAAAANGBh8fCRSZRWNsQh9aI5UNeTOGi`

**Office 365:**
- Sender Email: `info@entrynor.no`
- Service: Microsoft Graph API

**Key Vault:**
- Vault: `tt-secrets-vault`
- Secret: `EntrynorContactFormClientSecret`

## Monitoring & Troubleshooting

### Check Function Status
```bash
# View function details
az functionapp show \
  --resource-group entrynor-rg \
  --name entrynor-contact

# View recent invocations
az functionapp log tail \
  --resource-group entrynor-rg \
  --name entrynor-contact
```

### Common Issues

**Function not responding:**
- Check Azure Portal → Function App → Status
- Verify environment variables are set
- Check Application Insights logs

**Emails not sending:**
- Verify Microsoft Graph credentials
- Check `info@entrynor.no` exists in Office 365
- View detailed errors in Application Insights

**reCAPTCHA failing:**
- Ensure token is valid (use browser dev tools)
- Verify secret key matches reCAPTCHA admin console

**CORS errors:**
- Add origin to allowed list in Function App CORS settings
- Ensure function is returning proper CORS headers

## Files Overview

```
azure-function/
├── contact-form/
│   ├── function_app.py          # Main function code
│   └── function.json            # Binding configuration
├── requirements.txt             # Python dependencies
├── local.settings.json          # Local dev configuration
├── .gitignore                   # Git exclusions
└── README.md                    # Deployment guide

src/
├── components/
│   └── ContactFormI18n.astro    # Updated contact form
└── pages/
    └── api/
        └── contact.ts           # Original API (no longer used)

.env.example                      # Updated with function URL
.env.local                        # Updated with function URL
```

## Next: Update Credentials Database

After deploying, update `/Users/rp/wc-tripletex-integration/.credentials-database.md`:

Add Entrynor Contact Form section:
```markdown
## Entrynor Contact Form

- **Status**: Active
- **Function App**: entrynor-contact
- **Function URL**: https://entrynor-contact.azurewebsites.net/api/contact-form
- **Region**: West Europe
- **Runtime**: Python 3.11
- **Credentials**: See Azure Key Vault
```

## Summary

✅ **Complete** - Azure Function code ready for deployment
⏳ **Remaining** - Deploy to Azure (via Azure Portal or CLI)

The function is production-ready and will seamlessly integrate with the static Entrynor website to handle contact form submissions.
