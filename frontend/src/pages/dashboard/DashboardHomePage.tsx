export function DashboardHomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome to Your Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Courses Completed</span>
                <span>3/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Quizzes Passed</span>
                <span>5/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Completed "React Basics" quiz
            </li>
            <li className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Started "JavaScript Fundamentals"
            </li>
            <li className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              Updated profile information
            </li>
          </ul>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="font-medium text-sm">Mentorship Session</div>
              <div className="text-xs text-gray-600">Tomorrow, 2:00 PM</div>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <div className="font-medium text-sm">Code Review</div>
              <div className="text-xs text-gray-600">Friday, 10:00 AM</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a 
            href="/member-dashboard/docs"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-medium">Browse Docs</div>
          </a>
          <a 
            href="/member-dashboard/onboarding"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Continue Onboarding</div>
          </a>
          <a 
            href="/member-dashboard/profile"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium">Update Profile</div>
          </a>
          <a 
            href="/blog"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center"
          >
            <div className="text-2xl mb-2">✍️</div>
            <div className="font-medium">Read Blog</div>
          </a>
        </div>
      </div>
    </div>
  )
}