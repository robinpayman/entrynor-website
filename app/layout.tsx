import type { Metadata } from 'next';
import { defaultLocale, locales } from '@/i18n.config';
import './globals.css';

export const metadata: Metadata = {
  title: 'Entrynor - Premium Access Control Solutions',
  description: 'Premium access control products and solutions for secure access management across Europe',
  keywords: 'access control, security, armbands, key fobs, access cards',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e3a5f',
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale || defaultLocale}>
      <head>
        <meta name="google-site-verification" content="your-verification-code" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-356169640"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-356169640', {
                page_path: window.location.pathname,
              });
              // Google Ads conversion tracking
              gtag('event', 'page_view', {
                'send_to': 'AW-490500280'
              });
            `,
          }}
        />
      </head>
      <body className="bg-white text-charcoal">
        {children}
      </body>
    </html>
  );
}
