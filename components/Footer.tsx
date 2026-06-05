'use client';

import Link from 'next/link';

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="bg-navy-900 text-white mt-20">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Entrynor</h4>
            <p className="text-gray-400">Premium access control solutions for secure businesses</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Products</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href={`/${locale}/products`} className="hover:text-gold">Access Armbands</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-gold">Access Cards</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-gold">Key Fobs</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href={`/${locale}/about`} className="hover:text-gold">About</Link></li>
              <li><Link href={`/${locale}/certification`} className="hover:text-gold">Certification</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-gold">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href={`/${locale}/privacy`} className="hover:text-gold">Privacy</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-gold">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Entrynor AS. All rights reserved. | info@entrynor.no</p>
        </div>
      </div>
    </footer>
  );
}
