import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// This would be your condition fetching function
async function getCondition(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/conditions?filters[slug][$eq]=${slug}&populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    })
    
    const json = await res.json()
    return json.data[0] || null
  } catch (error) {
    console.error('Error fetching condition:', error)
    return null
  }
}

// This would fetch related articles for the condition
async function getConditionArticles(conditionId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[conditions][id][$eq]=${conditionId}&populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    })
    
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Error fetching condition articles:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const condition = await getCondition(params.slug)
  
  return {
    title: condition ? `${condition.attributes.name} - Health Information` : 'Condition Not Found',
    description: condition?.attributes.description || 'Learn about this health condition',
  }
}

export default async function ConditionPage({ params }: { params: { slug: string, lang: string } }) {
  const condition = await getCondition(params.slug)
  
  if (!condition) {
    notFound()
  }
  
  const articles = await getConditionArticles(condition.id)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Condition Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{condition.attributes.name}</h1>
          {condition.attributes.description && (
            <p className="text-lg text-gray-600 leading-relaxed">{condition.attributes.description}</p>
          )}
        </div>
        
        {/* Related Articles */}
        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article: any) => (
                <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">
                    <a href={`/blog/${article.attributes.category?.data?.attributes?.slug}/${article.attributes.slug}`} 
                       className="text-blue-600 hover:text-blue-800">
                      {article.attributes.title}
                    </a>
                  </h3>
                  {article.attributes.excerpt && (
                    <p className="text-gray-600 text-sm">{article.attributes.excerpt}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
