import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/app/[lang]/components/PageHeader";
import { notFound } from "next/navigation";

interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  cover?: {
    url?: string;
    alternativeText?: string;
    name?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles: Article[];
}

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  "diseases-and-conditions": "🦠",
  "symptoms-and-diagnosis": "🩺", 
  "drugs-and-medications": "💊",
  "wellness-and-lifestyle": "🧘",
  "maternal-and-child-health": "👶",
  "infectious-diseases": "🔬"
};

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/categories`;
    const urlParamsObject = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        articles: {
          populate: ["cover", "category"],
        }
      }
    };
    
    const { data } = await fetchAPI(path, urlParamsObject, token);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

interface Props {
  params: {
    slug: string;
    lang: string;
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="healthier-section healthier-section-hero healthier-section-alt relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -translate-y-20 translate-x-20"></div>
        
        <div className="relative content-container">
          <div className="text-center">
            {/* Category Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-6xl shadow-xl">
              {categoryIcons[category.slug] || "📋"}
            </div>
            
            {/* Category Name */}
            <h1 className="healthier-section-title text-4xl md:text-5xl lg:text-6xl mb-6">{category.name}</h1>
            
            {/* Description */}
            <p className="healthier-section-subtitle text-xl max-w-4xl mx-auto leading-relaxed mb-8">
              {category.description}
            </p>
            
            {/* Stats */}
            {category.articles && category.articles.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-blue-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold text-gray-700">
                  {category.articles.length} article{category.articles.length !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="healthier-section">
        <div className="content-container">

          {/* Articles Grid */}
          {category.articles && category.articles.length > 0 ? (
            <>
              <div className="healthier-section-header">
                <h2 className="healthier-section-title">Articles in {category.name}</h2>
                <div className="healthier-section-divider-line"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.articles.map((article) => {
                  // Handle cover image with null safety
                  let imageUrl = null;
                  let altText = "Article image";
                  
                  if (article.cover?.url) {
                    imageUrl = getStrapiMedia(article.cover.url);
                    altText = article.cover.alternativeText || article.cover.name || altText;
                  }

                  return (
                    <Link
                      key={article.id}
                      href={`/blog/${category.slug}/${article.slug}`}
                      className="group block transform hover:-translate-y-2 transition-all duration-300"
                    >
                      <Card className="h-full flex flex-col healthier-card-feature hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                        {imageUrl && (
                          <div className="relative h-52 w-full overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={altText}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                              <Badge variant="medical" className="shadow-lg">
                                {category.name}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <CardContent className="flex-1 flex flex-col justify-between p-6">
                          <div>
                            <CardTitle className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                              {article.title}
                            </CardTitle>
                            {article.description && (
                              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                {article.description}
                              </p>
                            )}
                          </div>
                          <div className="mt-6 flex items-center text-blue-600 text-sm font-semibold group-hover:text-blue-800 transition-colors duration-300">
                            <span>Read Article</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            /* Enhanced Empty State */
            <div className="healthier-section-header py-12">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-2-3H9m12 0a2 2 0 012 2v8a2 2 0 01-2 2h-2m-2-3v3m0 0h3m-3 0h-3" />
                </svg>
              </div>
              <h3 className="healthier-section-title text-center text-2xl mb-4">No articles yet</h3>
              <p className="healthier-section-subtitle text-center text-lg mb-8 max-w-lg mx-auto">
                We're working on adding comprehensive content for this category. Check back soon for valuable health information!
              </p>
              <div className="text-center">
                <Link 
                  href="/categories" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse Other Categories
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Back to Categories */}
          <div className="text-center mt-20 pt-8 border-t border-gray-200">
            <Link 
              href="/categories" 
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export const revalidate = 60; // Revalidate every minute
