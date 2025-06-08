import { Link } from 'react-router-dom'

export function Navigation() {
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-auto" src="/images/Ud_logo.png" alt="UnderdogDevs" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900">
              Blog
            </Link>
            <Link to="/spotlight" className="text-gray-700 hover:text-gray-900">
              Spotlight
            </Link>
            <Link to="/testimonials" className="text-gray-700 hover:text-gray-900">
              Testimonials
            </Link>
            <Link to="/donate" className="text-gray-700 hover:text-gray-900">
              Donate
            </Link>
            <Link to="/member-dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/signin" className="text-gray-700 hover:text-gray-900">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}