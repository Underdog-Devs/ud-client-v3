export function OnboardingPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Onboarding</h1>
      
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Complete Profile</span>
              <span className="text-green-600 font-semibold">✓ Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Initial Assessment</span>
              <span className="text-blue-600 font-semibold">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <span>First Mentorship Session</span>
              <span className="text-gray-400">Pending</span>
            </div>
          </div>
        </div>
        
        {/* Onboarding modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((module) => (
            <div key={module} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Module {module}</h3>
              <p className="text-gray-600 mb-4">
                Description of onboarding module {module} content and objectives.
              </p>
              <a 
                href={`/member-dashboard/onboarding/module-${module}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Start Module →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}