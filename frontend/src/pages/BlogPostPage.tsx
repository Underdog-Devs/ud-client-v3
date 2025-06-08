import { useParams } from 'react-router-dom'

export function BlogPostPage() {
  const { title, id } = useParams<{ title: string; id: string }>()
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Blog Post'}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <span>By John Doe</span>
            <span>•</span>
            <span>January 15, 2025</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
        </header>
        
        <img 
          src="/images/fallback.png" 
          alt="Blog post featured image"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
        
        <div className="space-y-6">
          <p>
            This is a sample blog post content for post ID: {id}. In a real application, 
            this content would be fetched from the FastAPI backend based on the route parameters.
          </p>
          
          <p>
            The blog post page demonstrates how React Router v6 handles dynamic routing 
            with parameters. The title and ID from the URL are available via the useParams hook.
          </p>
          
          <h2>Section Heading</h2>
          
          <p>
            More content would go here, including rich text formatting, images, 
            code blocks, and other elements that make up a complete blog post.
          </p>
          
          <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700">
            "This is an example quote that might appear in a blog post to highlight 
            important information or insights."
          </blockquote>
          
          <p>
            The concluding paragraph would wrap up the blog post content and 
            potentially include a call-to-action for readers.
          </p>
        </div>
        
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/fallback.png" 
                alt="Author avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-gray-600 text-sm">Software Engineer & Mentor</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Published on January 15, 2025
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}