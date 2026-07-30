export default function CertificationPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-wide max-w-3xl">
        <h1 className="text-5xl font-bold text-navy-900 mb-6">Miljøfyrtårn Certified</h1>
        <p className="text-xl text-gray-600 mb-12">
          Environmental Leadership in Access Control Technology
        </p>

        <div className="card-premium p-12 space-y-6">
          <div className="text-6xl text-gold mb-6">🌱</div>
          <h2 className="text-3xl font-bold text-navy-900">Our Environmental Commitment</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are proud to be Miljøfyrtårn certified, demonstrating our commitment to sustainability
            and environmental responsibility in all our operations. This certification reflects our dedication
            to reducing environmental impact while maintaining the highest standards of product quality and security.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-navy-50 p-6 rounded-lg">
              <h3 className="font-bold text-navy-900 mb-3">Sustainable Manufacturing</h3>
              <p className="text-gray-600">Eco-friendly production processes</p>
            </div>
            <div className="bg-navy-50 p-6 rounded-lg">
              <h3 className="font-bold text-navy-900 mb-3">Responsible Sourcing</h3>
              <p className="text-gray-600">Ethical material sourcing</p>
            </div>
            <div className="bg-navy-50 p-6 rounded-lg">
              <h3 className="font-bold text-navy-900 mb-3">Carbon Reduction</h3>
              <p className="text-gray-600">Minimized environmental footprint</p>
            </div>
            <div className="bg-navy-50 p-6 rounded-lg">
              <h3 className="font-bold text-navy-900 mb-3">Continuous Improvement</h3>
              <p className="text-gray-600">Ongoing sustainability initiatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
