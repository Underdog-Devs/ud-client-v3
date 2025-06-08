import { Link, useLocation } from 'react-router-dom'

export function AsideNavbar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/member-dashboard', label: 'Dashboard', exact: true },
    { path: '/member-dashboard/docs', label: 'Documentation' },
    { path: '/member-dashboard/onboarding', label: 'Onboarding' },
    { path: '/member-dashboard/profile', label: 'Profile' },
  ]
  
  return (
    <aside className="w-64 bg-gray-100 min-h-screen border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Member Dashboard
        </h2>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}