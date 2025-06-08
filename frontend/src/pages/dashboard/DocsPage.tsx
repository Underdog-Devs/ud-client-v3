export function DocsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Documentation</h1>
      
      <div className="space-y-8">
        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-4">
              Welcome to the UnderdogDevs documentation. Here you'll find everything you need 
              to know about our programs, resources, and how to make the most of your journey.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Complete your profile setup</li>
              <li>• Take the initial assessment</li>
              <li>• Schedule your first mentorship session</li>
              <li>• Join community discussions</li>
            </ul>
          </div>
        </section>
        
        {/* Learning Resources */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Programming Fundamentals</h3>
              <p className="text-gray-600 mb-4">
                Learn the basics of programming, data structures, and algorithms.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                View Resources →
              </a>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Web Development</h3>
              <p className="text-gray-600 mb-4">
                Master HTML, CSS, JavaScript, and modern frameworks.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                View Resources →
              </a>
            </div>
          </div>
        </section>
        
        {/* Community Guidelines */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Community Guidelines</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Respect and Inclusion</h4>
                <p className="text-gray-600">We maintain a welcoming environment for all community members.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Active Participation</h4>
                <p className="text-gray-600">Engage constructively in discussions and support fellow members.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Continuous Learning</h4>
                <p className="text-gray-600">Embrace the learning process and share your knowledge with others.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}