import { useParams } from 'react-router-dom'

export function BlogAuthorPage() {
  const { author, id } = useParams<{ author: string; id: string }>()
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Posts by {author?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h1>
      
      <p className="text-gray-600 mb-8">
        Showing post ID: {id} by author: {author}
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>This page will display posts filtered by author. Implementation coming in Phase 4B.</p>
      </div>
    </div>
  )
}