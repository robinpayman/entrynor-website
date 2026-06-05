import Head from 'next/head';

const messages = {
  en: {
    title: 'Premium Access Control Solutions',
    subtitle: 'Trusted by businesses across Europe',
    products: 'Our Products',
    armbands: 'Access Armbands',
    cards: 'Access Cards',
    keyfobs: 'Key Fobs',
    cert: 'Miljøfyrtårn Certified',
    exploreCta: 'Explore Products',
    viewDetails: 'View Details',
    whyChoose: 'Why Choose Entrynor?',
    qualityLabel: 'Quality',
    securityLabel: 'Security',
    innovationLabel: 'Innovation',
    trustLabel: 'Trust',
    learnMore: 'Learn More',
  },
  no: {
    title: 'Premium tilgangskontrollløsninger',
    subtitle: 'Stoler på av bedrifter over hele Europa',
    products: 'Våre produkter',
    armbands: 'Tilgangsarmbånd',
    cards: 'Tilgangskort',
    keyfobs: 'Nøkkelbrikker',
    cert: 'Miljøfyrtårn sertifisert',
    exploreCta: 'Utforsk produkter',
    viewDetails: 'Vis detaljer',
    whyChoose: 'Hvorfor velge Entrynor?',
    qualityLabel: 'Kvalitet',
    securityLabel: 'Sikkerhet',
    innovationLabel: 'Innovasjon',
    trustLabel: 'Tillit',
    learnMore: 'Les mer',
  },
  sv: {
    title: 'Premium lösningar för åtkomstkontroll',
    subtitle: 'Betrodd av företag över hela Europa',
    products: 'Våra produkter',
    armbands: 'Åtkomstarmbånd',
    cards: 'Åtkomstkort',
    keyfobs: 'Nyckeltaggar',
    cert: 'Miljölyktorna certifierad',
    exploreCta: 'Utforska produkter',
    viewDetails: 'Visa detaljer',
    whyChoose: 'Varför välja Entrynor?',
    qualityLabel: 'Kvalitet',
    securityLabel: 'Säkerhet',
    innovationLabel: 'Innovation',
    trustLabel: 'Förtroende',
    learnMore: 'Läs mer',
  },
  da: {
    title: 'Premium adgangskontrolløsninger',
    subtitle: 'Betroet af virksomheder i hele Europa',
    products: 'Vores produkter',
    armbands: 'Adgangsarmbånd',
    cards: 'Adgangskort',
    keyfobs: 'Nøglebrikker',
    cert: 'Miljøfyrtårn certificeret',
    exploreCta: 'Udforsk produkter',
    viewDetails: 'Se detaljer',
    whyChoose: 'Hvorfor vælge Entrynor?',
    qualityLabel: 'Kvalitet',
    securityLabel: 'Sikkerhed',
    innovationLabel: 'Innovation',
    trustLabel: 'Tillid',
    learnMore: 'Læs mere',
  },
  de: {
    title: 'Premium-Zutrittsschutzlösungen',
    subtitle: 'Von Unternehmen in ganz Europa vertraut',
    products: 'Unsere Produkte',
    armbands: 'Zutrittsbänder',
    cards: 'Zutrittskarten',
    keyfobs: 'Schlüsselanhänger',
    cert: 'Miljøfyrtårn zertifiziert',
    exploreCta: 'Produkte erkunden',
    viewDetails: 'Details anzeigen',
    whyChoose: 'Warum Entrynor wählen?',
    qualityLabel: 'Qualität',
    securityLabel: 'Sicherheit',
    innovationLabel: 'Innovation',
    trustLabel: 'Vertrauen',
    learnMore: 'Mehr erfahren',
  },
  fr: {
    title: 'Solutions premium de contrôle d\'accès',
    subtitle: 'Approuvé par les entreprises de toute l\'Europe',
    products: 'Nos produits',
    armbands: 'Brassards d\'accès',
    cards: 'Cartes d\'accès',
    keyfobs: 'Porte-clés',
    cert: 'Certifié Miljøfyrtårn',
    exploreCta: 'Explorer les produits',
    viewDetails: 'Voir les détails',
    whyChoose: 'Pourquoi choisir Entrynor?',
    qualityLabel: 'Qualité',
    securityLabel: 'Sécurité',
    innovationLabel: 'Innovation',
    trustLabel: 'Confiance',
    learnMore: 'En savoir plus',
  },
  es: {
    title: 'Soluciones premium de control de acceso',
    subtitle: 'Confiado por empresas en toda Europa',
    products: 'Nuestros productos',
    armbands: 'Pulseras de acceso',
    cards: 'Tarjetas de acceso',
    keyfobs: 'Llaveros',
    cert: 'Certificado Miljøfyrtårn',
    exploreCta: 'Explorar productos',
    viewDetails: 'Ver detalles',
    whyChoose: '¿Por qué elegir Entrynor?',
    qualityLabel: 'Calidad',
    securityLabel: 'Seguridad',
    innovationLabel: 'Innovación',
    trustLabel: 'Confianza',
    learnMore: 'Más información',
  },
};

export default function HomePage({ params }: { params: { locale: string } }) {
  const t = messages[params.locale as keyof typeof messages] || messages.en;

  return (
    <>
      <Head>
        <title>Entrynor - {t.title}</title>
        <meta name="description" content={t.subtitle} />
        <meta property="og:title" content={`Entrynor - ${t.title}`} />
        <meta property="og:description" content={t.subtitle} />
      </Head>

      {/* Hero Section - Narrative First */}
      <section className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal text-white flex items-center relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_40%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="container-wide relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold">Trusted by 1000+ European enterprises</span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                {t.title.split(' ').slice(0, 3).join(' ')}
                <span className="text-gold"> Access Control</span>
              </h1>
            </div>
            <p className="text-xl text-gray-200 leading-relaxed max-w-xl">
              {t.subtitle}. Our premium access control systems protect enterprise operations across Scandinavia and Europe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="btn-primary bg-gold text-navy-900 hover:bg-yellow-300 text-lg px-8 py-4 font-semibold">
                {t.exploreCta}
              </button>
              <button className="btn-outline text-white border-white hover:bg-white/10 text-lg px-8 py-4 font-semibold">
                Watch demo
              </button>
            </div>
            <div className="flex items-center gap-8 pt-8 text-sm text-gray-300">
              <div>
                <div className="text-2xl font-bold text-gold">20+</div>
                <p>Years experience</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">ISO 27001</div>
                <p>Certified</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">500K+</div>
                <p>Systems deployed</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-full aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <p className="text-gray-300">Enterprise-grade access control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-cream">
        <div className="container-wide">
          <h2 className="section-title text-center mb-16">{t.products}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: t.armbands, icon: '🎽' },
              { name: t.cards, icon: '🎫' },
              { name: t.keyfobs, icon: '🔑' },
            ].map((product, i) => (
              <div key={i} className="card-premium p-8 text-center hover:shadow-elevated transition-shadow">
                <div className="text-5xl mb-4">{product.icon}</div>
                <h3 className="text-2xl font-semibold text-navy-900 mb-4">{product.name}</h3>
                <p className="text-gray-600 mb-6">Premium quality access control solution</p>
                <button className="btn-secondary">{t.viewDetails}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-20 bg-navy-50">
        <div className="container-wide text-center">
          <div className="inline-block bg-gold text-navy-900 px-4 py-2 rounded-full mb-6 font-semibold">
            {t.cert}
          </div>
          <h2 className="section-title mb-4">Environmental Leadership</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Certified Miljøfyrtårn demonstrates our commitment to sustainability and environmental responsibility
          </p>
          <button className="btn-primary">{t.learnMore}</button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container-wide text-center">
          <h2 className="section-title mb-12">{t.whyChoose}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[t.qualityLabel, t.securityLabel, t.innovationLabel, t.trustLabel].map((item, i) => (
              <div key={i} className="p-8">
                <div className="text-4xl font-bold text-gold mb-4">✓</div>
                <h4 className="text-xl font-semibold text-navy-900 mb-3">{item}</h4>
                <p className="text-gray-600">Industry-leading {item.toLowerCase()} standards</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
