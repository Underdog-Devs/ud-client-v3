export function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder blog posts */}
        {[1, 2, 3, 4, 5, 6].map((post) => (
          <article key={post} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="/images/fallback.png" 
              alt="Blog post"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Blog Post Title {post}
              </h3>
              <p className="text-gray-600 mb-4">
                This is a preview of the blog post content. It gives readers 
                an idea of what the full article contains.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  January {post}, 2025
                </span>
                <a 
                  href={`/blog/sample-post-${post}/post-${post}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}