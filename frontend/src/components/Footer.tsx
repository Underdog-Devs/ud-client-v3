export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/images/Ud_logo.png" 
              alt="UnderdogDevs" 
              className="h-8 w-auto mb-4 filter brightness-0 invert"
            />
            <p className="text-gray-300 mb-4">
              Helping formerly incarcerated and economically disadvantaged individuals 
              break into the tech industry through mentorship and community support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                LinkedIn
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                GitHub
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="/spotlight" className="text-gray-300 hover:text-white">Spotlight</a></li>
              <li><a href="/testimonials" className="text-gray-300 hover:text-white">Testimonials</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li><a href="/member-dashboard" className="text-gray-300 hover:text-white">Join Community</a></li>
              <li><a href="/donate" className="text-gray-300 hover:text-white">Donate</a></li>
              <li><a href="/signin" className="text-gray-300 hover:text-white">Sign In</a></li>
              <li><a href="/signup" className="text-gray-300 hover:text-white">Sign Up</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 UnderdogDevs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}