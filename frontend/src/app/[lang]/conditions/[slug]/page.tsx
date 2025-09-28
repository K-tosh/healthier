import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAPI } from '../../utils/fetch-api';
import PageHeader from '../../components/PageHeader';
import ConditionArticleList from '../../views/condition-article-list';

interface ConditionPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

// Enhanced function to get condition with all related articles
async function getConditionWithArticles(slug: string) {
  try {
    // First, get the condition
    const conditionPath = `/conditions`;
    const conditionParams = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: ['icon', 'seo'],
    };

    console.log('🔍 Fetching condition with slug:', slug);
    const conditionResponse = await fetchAPI(conditionPath, conditionParams);
    
    if (!conditionResponse.data || conditionResponse.data.length === 0) {
      console.log('❌ No condition found');
      return null;
    }
    
    const condition = conditionResponse.data[0];
    console.log('✅ Found condition:', condition.name);
    
    // Then, get articles linked to this condition
    const articlesPath = `/articles`;
    const articlesParams = {
      filters: {
        relatedConditions: {
          slug: {
            $eq: slug,
          },
        },
      },
      populate: {
        cover: { fields: ['url'] },
        category: { populate: '*' },
        authorsBio: { populate: '*' },
      },
      sort: ['priority:desc', 'updatedAt:desc'],
    };

    const articlesResponse = await fetchAPI(articlesPath, articlesParams);
    const articles = articlesResponse.data || [];
    
    // Combine condition with articles
    condition.articles = articles;
    
    return condition;
  } catch (error) {
    console.error('Error fetching condition with articles:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ConditionPageProps): Promise<Metadata> {
  const condition = await getConditionWithArticles(params.slug);
  
  if (!condition) {
    return {
      title: 'Condition Not Found - HealthierKE',
      description: 'The requested health condition could not be found.',
    };
  }

  const name = condition.name || condition.attributes?.name;
  const description = condition.description || condition.attributes?.description;
  const articleCount = (condition.articles && condition.articles.length) || 0;

  return {
    title: `${name} - Complete Health Guide | HealthierKE`,
    description: `Complete guide to ${name}: ${description}. ${articleCount} expert articles covering symptoms, treatment, prevention, and more.`,
    keywords: `${name}, health condition, symptoms, treatment, prevention, Kenya health`,
    openGraph: {
      title: `${name} - Complete Health Guide`,
      description: `${description}. ${articleCount} expert articles covering symptoms, treatment, and prevention.`,
      type: 'article',
    },
  };
}

export default async function ConditionPage({ params }: ConditionPageProps) {
  const condition = await getConditionWithArticles(params.slug);

  if (!condition) {
    notFound();
  }

  // Process the condition data (handle both Strapi v4 and v5 formats)
  const conditionData = {
    name: condition.name || condition.attributes?.name,
    description: condition.description || condition.attributes?.description,
    overview: condition.overview || condition.attributes?.overview,
    isEmergency: condition.isEmergency || condition.attributes?.isEmergency || false,
    prevalenceInKenya: condition.prevalenceInKenya || condition.attributes?.prevalenceInKenya,
    color: condition.color || condition.attributes?.color,
    priority: condition.priority || condition.attributes?.priority,
  };

  // Get articles
  const articles = condition.articles || [];
  const articleCount = articles.length;
  
  // Enhanced empty state
  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <PageHeader 
              heading={conditionData.name} 
              text={conditionData.description || `Learn about ${conditionData.name} - causes, symptoms, treatment, and prevention.`}
            />
            
            {/* Condition Stats */}
            <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                {conditionData.isEmergency && (
                  <>
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.19 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-600 font-semibold">Emergency Condition</span>
                  </>
                )}
              </div>
              {conditionData.prevalenceInKenya && (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>In Kenya: {conditionData.prevalenceInKenya}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="medical-card p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Available</h3>
            <p className="text-gray-600 mb-6">We're working on adding comprehensive articles about {conditionData.name}. Check back soon for detailed information.</p>
            <a 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse All Health Articles
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <PageHeader 
            heading={conditionData.name} 
            text={conditionData.description || `Comprehensive information about ${conditionData.name} including symptoms, treatment, prevention, and expert insights.`}
          />
          
          {/* Condition Stats */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{articles.length} {articles.length === 1 ? 'Article' : 'Articles'}</span>
            </div>
            {conditionData.isEmergency && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.19 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-600 font-semibold">Emergency Condition</span>
              </div>
            )}
            {conditionData.prevalenceInKenya && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>In Kenya: {conditionData.prevalenceInKenya}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Use the same article list component as blog */}
      <ConditionArticleList data={articles} condition={conditionData} />
    </div>
  );
}
