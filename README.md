# Entrynor.no Website

Premium production supplier website built with Astro, bilingual (Norwegian/English), with contact forms and i18n routing.

## Deployment Architecture

⚠️ **IMPORTANT**: www.entrynor.no is NOT served by Vercel. It is hosted on a separate Apache server.

### Live Site
- **Domain**: https://www.entrynor.no (Apache server)
- **SSH Key**: `~/.ssh/entrynor-uniweb` (private key)
- **Deployment**: SCP to Apache server (see instructions below)

### Vercel Projects (for testing/preview only)
- **minor-mercury**: https://minor-mercury.vercel.app (connected to GitHub)
- **entrynor-website**: Preview deployments only

## Deployment to Production (Apache Server)

To deploy changes to www.entrynor.no:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy via SCP** (using entrynor-uniweb SSH key):
   ```bash
   scp -i ~/.ssh/entrynor-uniweb -r dist/* user@entrynor-server:/path/to/website/
   ```

3. **OR use the Vercel CLI** (if Apache server syncs from Vercel):
   ```bash
   vercel deploy --prod --project minor-mercury
   ```

**⚠️ UPDATE NEEDED**: Document the actual Apache server hostname, path, and user credentials in a secure credentials file.

## Local Development

| Command           | Action                                    |
| :---------------- | :---------------------------------------- |
| `npm install`     | Installs dependencies                     |
| `npm run dev`     | Starts dev server at `localhost:4321`     |
| `npm run build`   | Build to `./dist/`                        |
| `npm run preview` | Preview production build locally           |

## Project Structure

```
/
├── src/                    # Main source (root site)
│   ├── pages/[lang]/       # Dynamic i18n routes
│   ├── components/         # Astro components
│   └── utils/i18n.ts       # Internationalization
├── minor-mercury/          # Vercel preview project
│   └── src/                # Same structure as root
├── public/                 # Static assets
├── dist/                   # Built output (git ignored)
└── vercel.json             # Vercel config
```

## Key Files for Deployment

- **INFRASTRUCTURE_GUIDE.md** - Complete reference for hosting, credentials, and server setup
- **VERCEL_SETUP.md** - Vercel-specific configuration (contact form API)
- **vercel.json** - Build settings (currently set to build from root `/src`)

## Important Notes

1. **www.entrynor.no points to Apache, not Vercel** - This was the source of deployment confusion. Always deploy to the Apache server when changing the live site.
2. **Source files must be updated in `/src/pages/[lang]/index.astro`** (root, not minor-mercury) for Apache deployments
3. **SSH key**: `~/.ssh/entrynor-uniweb` provides API access to the Apache server

## Contact Form

- Uses Resend API for email delivery
- Endpoint: `/api/contact-form` (Vercel serverless)
- Bilingual validation (Norwegian/English)
