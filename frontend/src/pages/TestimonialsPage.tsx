export function TestimonialsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Testimonials</h1>
      
      <p className="text-lg text-gray-600 mb-12 max-w-3xl">
        Hear from our community members about their journey and how UnderdogDevs 
        has impacted their lives and careers.
      </p>
      
      <div className="space-y-8">
        {/* Testimonials */}
        {[
          {
            id: 1,
            name: "Sarah Johnson",
            role: "Full Stack Developer",
            company: "Tech Corp",
            quote: "UnderdogDevs gave me the confidence and skills I needed to transition from incarceration to a successful tech career. The mentorship program was life-changing.",
            image: "/images/fallback.png"
          },
          {
            id: 2,
            name: "Marcus Williams",
            role: "Frontend Developer",
            company: "StartupXYZ",
            quote: "The community support and technical training I received helped me land my dream job. I'm now mentoring others through the same program that helped me.",
            image: "/images/fallback.png"
          },
          {
            id: 3,
            name: "Jessica Chen",
            role: "Data Analyst",
            company: "DataFlow Inc",
            quote: "Coming from an economically disadvantaged background, I never thought I could work in tech. UnderdogDevs proved me wrong and opened doors I never knew existed.",
            image: "/images/fallback.png"
          }
        ].map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start space-x-6">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <blockquote className="text-lg text-gray-700 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Call to Action */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 mb-6">
          Join our community and begin your transformation into a tech professional.
        </p>
        <a 
          href="/member-dashboard"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Join UnderdogDevs
        </a>
      </div>
    </div>
  )
}