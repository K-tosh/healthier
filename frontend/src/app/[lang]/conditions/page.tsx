import Link from 'next/link'
import { Metadata } from 'next'

async function getConditions() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/conditions?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    })
    
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Error fetching conditions:', error)
    return []
  }
}

export const metadata: Metadata = {
  title: 'Health Conditions A-Z | Healthier Kenya',
  description: 'Browse all health conditions and medical information.',
}

export default async function ConditionsPage() {
  const conditions = await getConditions()
  
  // Sort conditions alphabetically
  const sortedConditions = conditions.sort((a: any, b: any) => 
    a.attributes.name.localeCompare(b.attributes.name)
  )
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Conditions A-Z</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our comprehensive database of health conditions. Get reliable information about symptoms, 
            causes, treatments, and prevention strategies.
          </p>
        </div>
        
        {/* Conditions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedConditions.map((condition: any) => (
            <Link
              key={condition.id}
              href={`/conditions/${condition.attributes.slug}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-200 group"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {condition.attributes.name}
              </h3>
              {condition.attributes.description && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {condition.attributes.description}
                </p>
              )}
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
                Learn More
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        {conditions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No conditions found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
