export function SpotlightPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Member Spotlight</h1>
      
      <p className="text-lg text-gray-600 mb-12 max-w-3xl">
        Meet some of our amazing community members who have successfully transitioned 
        into tech careers and are making a difference in their lives and communities.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Spotlight profiles */}
        {[1, 2, 3, 4, 5, 6].map((member) => (
          <div key={member} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="/images/fallback.png" 
              alt={`Member ${member}`}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Member {member}
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                Software Engineer
              </p>
              <p className="text-gray-600 mb-4">
                "UnderdogDevs provided me with the mentorship and community support 
                I needed to successfully transition into a tech career."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Joined: 2024
                </span>
                <a 
                  href={`/spotlight/member-${member}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read Story →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}