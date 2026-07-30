'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={params.locale} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer locale={params.locale} />
    </div>
  );
}
