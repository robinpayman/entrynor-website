# Entrynor AS - Modern Website 2026

Premium access control solutions website built with Next.js 14, Tailwind CSS, and TypeScript.

## Features

✅ **Multilingual Support** (7 languages)
- English, Norwegian, Swedish, Danish, German, French, Spanish
- Dynamic routing with locale-based URLs

✅ **Premium Design**
- Navy/Gold color scheme for trust and elegance
- Responsive mobile-first design
- Smooth animations and transitions

✅ **SEO Optimized**
- Next.js metadata management
- Schema.org structured data
- XML sitemap support
- robots.txt configuration
- Open Graph tags for social sharing

✅ **Analytics Integration**
- Google Analytics 4 ready (update GTM ID in `app/layout.tsx`)
- Google Ads conversion tracking
- Event tracking setup

✅ **Performance**
- Static pre-rendering for fast load times
- Image optimization
- CSS optimization with Tailwind
- Minimal JavaScript bundle

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000/en` to see the site.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /[locale]          # Dynamic locale routing
    /contact         # Contact page
    /certification   # Miljøfyrtårn certification page
    page.tsx         # Homepage
    layout.tsx       # Locale layout wrapper
  layout.tsx         # Root layout
  globals.css        # Global styles

/components
  Header.tsx         # Navigation header with language switcher
  Footer.tsx         # Site footer

/messages
  en.json           # English translations
  no.json           # Norwegian translations
  sv.json           # Swedish translations
  da.json           # Danish translations
  de.json           # German translations
  fr.json           # French translations
  es.json           # Spanish translations

/public
  robots.txt        # Search engine configuration
```

## Configuration

### Update Google Analytics

Edit `app/layout.tsx` and replace `G-XXXXXXXXXX` with your actual GA4 ID:

```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_ID"></script>
```

### Update Domain

Replace `entrynor.no` domain references:
- `next.config.js` - Image domains
- `public/robots.txt` - Sitemap URL
- `app/layout.tsx` - Google verification

### Add Contact Form Backend

The contact form is currently a UI placeholder. To enable it:

1. Create an API route at `/app/api/contact/route.ts`
2. Connect to your email service (SendGrid, Mailgun, etc.)
3. Update the form submission handler

### Add Product Pages

Create individual product pages:
- `/app/[locale]/products/page.tsx` - Product listing
- `/app/[locale]/products/[product]/page.tsx` - Product details

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/yourusername/entrynor-website.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Keep default settings (Next.js will be auto-detected)
5. Click "Deploy"

### Step 3: Update DNS at ProISP

After Vercel deployment, update your DNS records at ProISP:

**Replace ProISP nameservers with Vercel's:**
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

**Or add CNAME record:**
- Host: `entrynor.no`
- Target: `cname.vercel-dns.com`

Wait 24-48 hours for DNS propagation.

### Step 4: Configure Custom Domain in Vercel

1. Go to Vercel project settings
2. Select "Domains"
3. Add `entrynor.no`
4. Follow instructions for DNS validation

## Environment Variables

Create `.env.local` for development:

```env
# Analytics (if using other services)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API endpoints
NEXT_PUBLIC_API_URL=https://api.example.com
```

## SSL/Security

✅ Automatic SSL certificate with Vercel (HTTPS enabled by default)
✅ Security headers configured in `next.config.js`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Translations

To add or update translations, edit the JSON files in `/messages`:

```json
{
  "nav": {
    "home": "...",
    "products": "..."
  },
  "hero": {...},
  ...
}
```

The messages are loaded based on the URL locale.

## Performance & SEO Checklist

- [ ] Replace GA4 ID in layout.tsx
- [ ] Update domain in next.config.js
- [ ] Update sitemap URL in robots.txt
- [ ] Add product images to /public/images
- [ ] Configure Google Search Console
- [ ] Set up Google Analytics 4 events
- [ ] Configure Google Ads conversion tracking
- [ ] Add JSON-LD structured data for products
- [ ] Create/update product pages
- [ ] Add contact form backend
- [ ] Deploy to Vercel
- [ ] Update ProISP DNS records

## Technologies

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Hosting**: Vercel
- **Analytics**: Google Analytics 4
- **DNS**: ProISP

## License

© 2026 Entrynor AS. All rights reserved.

## Support

For questions or issues, contact: info@entrynor.no
