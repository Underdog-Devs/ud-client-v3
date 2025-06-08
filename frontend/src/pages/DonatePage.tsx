export function DonatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Support Our Mission
      </h1>
      
      <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        Your donation helps us provide mentorship, education, and support to formerly 
        incarcerated and economically disadvantaged individuals entering the tech industry.
      </p>
      
      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">$50</div>
          <div className="text-gray-700">Funds one mentorship session</div>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">$150</div>
          <div className="text-gray-700">Provides one month of career support</div>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-2">$500</div>
          <div className="text-gray-700">Sponsors a full training program</div>
        </div>
      </div>
      
      {/* Donation Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Make a Donation</h2>
        
        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Amount
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[25, 50, 100, 250].map((amount) => (
              <button
                key={amount}
                className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <input 
              type="number" 
              placeholder="Custom amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Donation Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Donation Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="type" value="one-time" className="mr-2" defaultChecked />
              One-time
            </label>
            <label className="flex items-center">
              <input type="radio" name="type" value="monthly" className="mr-2" />
              Monthly
            </label>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Proceed to Payment
        </button>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Your donation is secure and helps change lives through technology education.
        </p>
      </div>
      
      {/* Other Ways to Help */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Other Ways to Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-semibold mb-2">Become a Mentor</h3>
            <p className="text-gray-600 text-sm">Share your expertise and guide someone's career journey.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="font-semibold mb-2">Partner with Us</h3>
            <p className="text-gray-600 text-sm">Help us create job opportunities for our community members.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📢</div>
            <h3 className="font-semibold mb-2">Spread the Word</h3>
            <p className="text-gray-600 text-sm">Share our mission and help us reach more people who need support.</p>
          </div>
        </div>
      </div>
    </div>
  )
}