'use client';

import Link from 'next/link';
import Image from 'next/image';
import { localeNames, locales } from '@/i18n.config';
const navLabels: Record<string, Record<string, string>> = {
  en: { home: 'Home', products: 'Products', certification: 'Certification', contact: 'Contact' },
  no: { home: 'Hjem', products: 'Produkter', certification: 'Sertifisering', contact: 'Kontakt' },
  sv: { home: 'Hem', products: 'Produkter', certification: 'Certifiering', contact: 'Kontakt' },
  da: { home: 'Hjem', products: 'Produkter', certification: 'Certificering', contact: 'Kontakt' },
  de: { home: 'Startseite', products: 'Produkte', certification: 'Zertifizierung', contact: 'Kontakt' },
  fr: { home: 'Accueil', products: 'Produits', certification: 'Certification', contact: 'Contact' },
  es: { home: 'Inicio', products: 'Productos', certification: 'Certificación', contact: 'Contacto' },
};

export default function Header({ locale }: { locale: string }) {
  const nav = navLabels[locale] || navLabels.en;
  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      <nav className="container-wide py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image src="/images/logo.svg" alt="Entrynor" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold text-navy-900 hidden sm:inline">Entrynor</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href={`/${locale}`} className="text-charcoal hover:text-gold transition-colors">
            {nav.home}
          </Link>
          <Link href={`/${locale}/products`} className="text-charcoal hover:text-gold transition-colors">
            {nav.products}
          </Link>
          <Link href={`/${locale}/certification`} className="text-charcoal hover:text-gold transition-colors">
            {nav.certification}
          </Link>
          <Link href={`/${locale}/contact`} className="text-charcoal hover:text-gold transition-colors">
            {nav.contact}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={locale}
            onChange={(e) => {
              window.location.href = `/${e.target.value}`;
            }}
            className="px-4 py-2 border border-navy-300 rounded-md text-navy-900 bg-white cursor-pointer"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeNames[l]}
              </option>
            ))}
          </select>
          <Link href={`/${locale}/contact`} className="btn-primary text-sm">
            {nav.contact}
          </Link>
        </div>
      </nav>
    </header>
  );
}
