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
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        heading={category.name}
        text={category.description}
      />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Info Card */}
          <div className="mb-12">
            <Card className="medical-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
                {categoryIcons[category.slug] || "📋"}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {category.description}
              </p>
              {category.articles && category.articles.length > 0 && (
                <div className="mt-6">
                  <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                    {category.articles.length} article{category.articles.length !== 1 ? 's' : ''} available
                  </Badge>
                </div>
              )}
            </Card>
          </div>

          {/* Articles Grid */}
          {category.articles && category.articles.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles in {category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="group block"
                    >
                      <Card className="h-full flex flex-col medical-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                        {imageUrl && (
                          <div className="relative h-48 w-full overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={altText}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-blue-600 text-white">
                                {category.name}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardContent className="flex-1 flex flex-col justify-between p-6">
                          <div>
                            <CardTitle className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                              {article.title}
                            </CardTitle>
                            {article.description && (
                              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                {article.description}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
                            Read Article
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-2-3H9m12 0a2 2 0 012 2v8a2 2 0 01-2 2h-2m-2-3v3m0 0h3m-3 0h-3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-500 mb-6">Articles for this category will appear here when published.</p>
              <Link 
                href="/categories" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Other Categories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}

          {/* Back to Categories */}
          <div className="text-center mt-16">
            <Link 
              href="/categories" 
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
