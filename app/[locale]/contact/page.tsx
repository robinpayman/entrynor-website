export default function ContactPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container-wide max-w-2xl">
        <h1 className="text-5xl font-bold text-navy-900 mb-6">Get In Touch</h1>
        <p className="text-xl text-gray-600 mb-12">Contact Entrynor AS</p>

        <div className="space-y-8">
          <div className="card-premium p-8">
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Email</h3>
            <a href="mailto:info@entrynor.no" className="text-gold text-lg hover:underline">
              info@entrynor.no
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
