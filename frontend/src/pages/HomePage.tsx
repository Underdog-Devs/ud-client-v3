export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to UnderdogDevs
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Helping formerly incarcerated and economically disadvantaged individuals 
            break into the tech industry through mentorship, education, and community support.
          </p>
          <div className="space-x-4">
            <a 
              href="/member-dashboard" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Our Community
            </a>
            <a 
              href="/donate" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Support Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Members Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Job Placements</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6">
                We believe that everyone deserves a second chance and the opportunity to build 
                a successful career in technology. Our community provides the mentorship, 
                resources, and support needed to overcome barriers and achieve success.
              </p>
              <p className="text-gray-600">
                Through our programs, we help individuals develop technical skills, build 
                professional networks, and gain the confidence needed to thrive in the tech industry.
              </p>
            </div>
            <div>
              <img 
                src="/images/together.jpg" 
                alt="Community members working together"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}