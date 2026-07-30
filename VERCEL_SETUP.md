# Vercel Contact Form API Setup

The contact form is now deployed as a serverless function on Vercel. Follow these steps to complete the setup:

## Step 1: Set Environment Variables in Vercel

Go to your Vercel project dashboard (https://vercel.com/dashboard) and add these environment variables:

### Required Variables:
- `AZURE_TENANT_ID`: `b3a4640e-1e58-4947-a114-09fdc17ec7ea`
- `AZURE_CLIENT_ID`: `831d1ba6-4929-4d89-9fb9-01ea3033e13e`
- `AZURE_CLIENT_SECRET`: *(Get from Azure Key Vault or your credentials database)*
- `RECAPTCHA_SECRET_KEY`: `6Ler10QnAAAAANGBh8fCRSZRWNsQh9aI5UNeTOGi`
- `CONTACT_EMAIL`: `info@entrynor.no`
- `EMAIL_SENDER`: `noreply@entrynor.no`

### Steps:
1. Go to **Project Settings** → **Environment Variables**
2. Add each variable above with its value
3. Select **Production** and **Preview** environments
4. Save

## Step 2: Create Local .env.local (Optional for local testing)

Create `.env.local` in the project root with the environment variables above. This file is gitignored.

```bash
AZURE_TENANT_ID=b3a4640e-1e58-4947-a114-09fdc17ec7ea
AZURE_CLIENT_ID=831d1ba6-4929-4d89-9fb9-01ea3033e13e
AZURE_CLIENT_SECRET=<your-secret>
RECAPTCHA_SECRET_KEY=6Ler10QnAAAAANGBh8fCRSZRWNsQh9aI5UNeTOGi
CONTACT_EMAIL=info@entrynor.no
EMAIL_SENDER=noreply@entrynor.no
```

## Step 3: Deploy to Vercel

Push to main branch:
```bash
git add .
git commit -m "feat: Add Vercel serverless contact form API"
git push origin main
```

Vercel automatically deploys on push.

## Step 4: Test the Form

1. Go to https://minor-mercury.vercel.app (or your deployed URL)
2. Fill in the contact form with test data
3. Submit
4. Check that:
   - Form shows "Message Sent" confirmation
   - Email arrives at `info@entrynor.no`
   - Console shows no errors

## Architecture

- **Frontend**: Astro component at `src/components/ContactFormI18n.astro`
- **Backend**: Vercel serverless function at `api/contact-form.ts`
- **Email**: Microsoft Graph API via Azure AD (Client Credentials flow)
- **Spam Protection**: Google reCAPTCHA v2

## Troubleshooting

### Form submission fails
- Check browser console for errors
- Check Vercel function logs: Project → Deployments → Function Logs
- Verify environment variables are set in Vercel

### Email not sent
- Check Vercel logs for Microsoft Graph API errors
- Verify `AZURE_CLIENT_SECRET` is correct
- Ensure Azure AD app has Mail.Send permission

### reCAPTCHA errors
- Verify `RECAPTCHA_SECRET_KEY` is correct
- Check Google reCAPTCHA dashboard for rate limits
