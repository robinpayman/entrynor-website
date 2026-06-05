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
  },
  no: {
    title: 'Premium tilgangskontrollløsninger',
    subtitle: 'Stoler på av bedrifter over hele Europa',
    products: 'Våre produkter',
    armbands: 'Tilgangsarmbånd',
    cards: 'Tilgangskort',
    keyfobs: 'Nøkkelbrikker',
    cert: 'Miljøfyrtårn sertifisert',
  },
  sv: {
    title: 'Premium lösningar för åtkomstkontroll',
    subtitle: 'Betrodd av företag över hela Europa',
    products: 'Våra produkter',
    armbands: 'Åtkomstarmbånd',
    cards: 'Åtkomstkort',
    keyfobs: 'Nyckeltaggar',
    cert: 'Miljölyktorna certifierad',
  },
  da: {
    title: 'Premium adgangskontrolløsninger',
    subtitle: 'Betroet af virksomheder i hele Europa',
    products: 'Vores produkter',
    armbands: 'Adgangsarmbånd',
    cards: 'Adgangskort',
    keyfobs: 'Nøglebrikker',
    cert: 'Miljøfyrtårn certificeret',
  },
  de: {
    title: 'Premium-Zutrittsschutzlösungen',
    subtitle: 'Von Unternehmen in ganz Europa vertraut',
    products: 'Unsere Produkte',
    armbands: 'Zutrittsbänder',
    cards: 'Zutrittskarten',
    keyfobs: 'Schlüsselanhänger',
    cert: 'Miljøfyrtårn zertifiziert',
  },
  fr: {
    title: 'Solutions premium de contrôle d\'accès',
    subtitle: 'Approuvé par les entreprises de toute l\'Europe',
    products: 'Nos produits',
    armbands: 'Brassards d\'accès',
    cards: 'Cartes d\'accès',
    keyfobs: 'Porte-clés',
    cert: 'Certifié Miljøfyrtårn',
  },
  es: {
    title: 'Soluciones premium de control de acceso',
    subtitle: 'Confiado por empresas en toda Europa',
    products: 'Nuestros productos',
    armbands: 'Pulseras de acceso',
    cards: 'Tarjetas de acceso',
    keyfobs: 'Llaveros',
    cert: 'Certificado Miljøfyrtårn',
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

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800 text-white flex items-center">
        <div className="container-wide text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t.title}</h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">{t.subtitle}</p>
          <button className="btn-primary bg-gold text-navy-900 hover:bg-yellow-400">
            Explore Products
          </button>
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
                <button className="btn-secondary">View Details</button>
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
          <button className="btn-primary">Learn More</button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container-wide text-center">
          <h2 className="section-title mb-12">Why Choose Entrynor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['Quality', 'Security', 'Innovation', 'Trust'].map((item, i) => (
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
