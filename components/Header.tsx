'use client';

import Link from 'next/link';
import { localeNames, locales } from '@/i18n.config';

export default function Header({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      <nav className="container-wide py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-2xl font-bold text-navy-900">
          Entrynor
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href={`/${locale}`} className="text-charcoal hover:text-gold transition-colors">
            Home
          </Link>
          <Link href={`/${locale}/products`} className="text-charcoal hover:text-gold transition-colors">
            Products
          </Link>
          <Link href={`/${locale}/certification`} className="text-charcoal hover:text-gold transition-colors">
            Certification
          </Link>
          <Link href={`/${locale}/contact`} className="text-charcoal hover:text-gold transition-colors">
            Contact
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
          <button className="btn-primary text-sm">Contact</button>
        </div>
      </nav>
    </header>
  );
}
