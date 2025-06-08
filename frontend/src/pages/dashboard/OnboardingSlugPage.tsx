import { useParams } from 'react-router-dom'

export function OnboardingSlugPage() {
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Onboarding: {slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Onboarding content for slug: {slug} will be migrated from Next.js in Phase 4.</p>
      </div>
    </div>
  )
}