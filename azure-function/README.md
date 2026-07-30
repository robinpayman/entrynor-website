# Entrynor Contact Form - Azure Function

This directory contains the serverless Azure Function that handles contact form submissions for the Entrynor website.

## What It Does

The function:
1. Receives form submissions (name, phone, email, message, reCAPTCHA token)
2. Validates the reCAPTCHA token with Google
3. Authenticates with Microsoft Graph API using Azure AD credentials
4. Sends an email to `info@entrynor.no` with the submission details
5. Sends a confirmation email back to the user
6. Returns success/error response to the form

## Prerequisites

- Azure subscription
- Azure Functions Core Tools: `brew install azure-functions-core-tools@4`
- Python 3.11+
- Azure CLI: `brew install azure-cli`

## Development Setup

1. **Install dependencies:**
```bash
cd azure-function
pip install -r requirements.txt
```

2. **Configure local settings:**
   - Edit `local.settings.json` with your actual values:
     - `EMAIL_GRAPH_CLIENT_SECRET`: Get from Azure Key Vault or Azure AD
     - Other values should already be pre-filled

3. **Run locally:**
```bash
func start
```

The function will be available at: `http://localhost:7071/api/contact-form`

4. **Test the function:**
```bash
curl -X POST http://localhost:7071/api/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+47 123 45 678",
    "email": "test@example.com",
    "message": "Test message",
    "recaptchaToken": "test-token"
  }'
```

## Production Deployment

### Option 1: Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if needed)
az group create --name entrynor-rg --location westeurope

# Create a storage account (if needed)
az storage account create \
  --name entrynorstore \
  --resource-group entrynor-rg \
  --location westeurope

# Create Function App
az functionapp create \
  --name entrynor-contact \
  --storage-account entrynorstore \
  --runtime python \
  --runtime-version 3.11 \
  --resource-group entrynor-rg \
  --functions-version 4 \
  --os-type Linux

# Deploy function code
func azure functionapp publish entrynor-contact
```

### Option 2: Using Azure Portal

1. Create new Function App via Azure Portal
2. Set runtime to Python 3.11
3. Configure Function App settings with environment variables
4. Deploy using Visual Studio Code or Azure CLI

## Configuration

After deployment, set these environment variables in the Function App configuration:

- `EMAIL_GRAPH_TENANT_ID`: `b3a4640e-1e58-4947-a114-09fdc17ec7ea`
- `EMAIL_GRAPH_CLIENT_ID`: `831d1ba6-4929-4d89-9fb9-01ea3033e13e`
- `EMAIL_GRAPH_CLIENT_SECRET`: Retrieve from Azure Key Vault (tt-secrets-vault/EntrynorContactFormClientSecret)
- `RECAPTCHA_SECRET_KEY`: `6Ler10QnAAAAANGBh8fCRSZRWNsQh9aI5UNeTOGi`
- `EMAIL_GRAPH_SENDER`: `info@entrynor.no`

**For secret values, use Key Vault references:**
```
@Microsoft.KeyVault(SecretUri=https://tt-secrets-vault.vault.azure.net/secrets/EntrynorContactFormClientSecret/)
```

## CORS Configuration

The function handles CORS automatically in the code, but you can also configure it in the Function App:

1. Azure Portal → Function App → CORS
2. Add allowed origins:
   - `https://entrynor.no`
   - `https://www.entrynor.no`
   - `http://localhost:4321` (local development)
   - `http://localhost:4322` (local development)

## Function URL

After deployment, the function will be available at:
```
https://entrynor-contact.azurewebsites.net/api/contact-form
```

Update `PUBLIC_AZURE_FUNCTION_URL` in the website's `.env.local` with the actual function URL.

## Monitoring

Monitor the function in Azure Portal:
- Function App → Monitor
- View invocations, duration, and errors
- Check Application Insights for detailed logs

## Troubleshooting

### Function not responding
- Check Function App is running: Azure Portal → Overview → Status
- Check logs in Application Insights
- Verify environment variables are set correctly

### Emails not sending
- Check Microsoft Graph credentials are correct
- Verify `info@entrynor.no` account exists in Office 365
- Check Application Insights logs for Graph API error messages

### reCAPTCHA validation failing
- Verify `RECAPTCHA_SECRET_KEY` is correct
- Check reCAPTCHA admin console for valid tokens

## Files

- `function_app.py`: Main function code
- `function.json`: Function binding configuration
- `requirements.txt`: Python dependencies
- `local.settings.json`: Local development configuration (DO NOT COMMIT with real secrets)
