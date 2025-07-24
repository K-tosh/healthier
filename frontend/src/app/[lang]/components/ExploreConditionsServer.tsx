// components/ExploreConditionsServer.tsx
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { getFeaturedArticles } from "@/app/[lang]/utils/get-featured-articles";

// Define types for conditions and articles
interface Condition {
  id?: string | number;
  name: string;
  slug?: string;
  attributes?: {
    name: string;
    slug: string;
  };
}

interface Article {
  id: string | number;
  attributes: {
    slug: string;
    title: string;
    description?: string;
    excerpt?: string;
    cover?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    category?: {
      data?: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
  };
}

interface ExploreConditionsServerProps {
  data: {
    heading?: string;
    description?: string;
    conditions?: Condition[] | { data: Condition[] };
  };
}

export default async function ExploreConditionsServer({ data }: ExploreConditionsServerProps) {
  // Handle different data structures for conditions/categories
  let conditionsArray: Condition[] = [];
  
  if (data.conditions) {
    conditionsArray = Array.isArray(data.conditions) 
      ? data.conditions 
      : data.conditions.data || [];
  }

  // Fallback conditions using your actual Strapi conditions
  const fallbackConditions: Condition[] = [
    { name: "Anxiety", slug: "anxiety" },
    { name: "Asthma", slug: "asthma" },
    { name: "Depression", slug: "depression" },
    { name: "Diabetes Mellitus", slug: "diabetis-mellitus" },
    { name: "Endometriosis", slug: "endometriosis" },
    { name: "Hypertension", slug: "hypertension" },
    { name: "Infertility", slug: "infertility" },
    { name: "Malaria", slug: "malaria" },
    { name: "Tuberculosis", slug: "tuberculosis" },
    { name: "Typhoid Fever", slug: "typhoid-fever" }
  ];

  // Use fallback conditions if no conditions are available
  if (conditionsArray.length === 0) {
    conditionsArray = fallbackConditions;
  }

  // Fetch featured articles server-side
  const articlesArray: Article[] = await getFeaturedArticles(3);
  
  const heading = data.heading || "Explore Health Conditions";
  const description = data.description;

  if (!data) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading Row */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Condition Pills */}
        {conditionsArray.length > 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {conditionsArray.slice(0, 8).map((condition: Condition, index: number) => {
                const name = condition.attributes?.name || condition.name;
                const slug = condition.attributes?.slug || condition.slug;
                
                return (
                  <Link
                    key={condition.id || index}
                    href={slug ? `/conditions/${slug}` : "/conditions"}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mb-12">
              <Link 
                href="/conditions" 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
              >
                View All Health Conditions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}

        {/* Featured Articles Grid */}
        {articlesArray.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Health Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesArray.map((article: Article) => {
                const imageUrl = getStrapiMedia(article.attributes.cover?.data?.attributes?.url || null);
                const categoryName = article.attributes.category?.data?.attributes?.name;
                const categorySlug = article.attributes.category?.data?.attributes?.slug;
                
                return (
                  <Link
                    key={article.id}
                    href={`/blog/${categorySlug || 'general'}/${article.attributes.slug}`}
                    className="group block"
                  >
                    <Card className="h-full flex flex-col medical-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={article.attributes.cover?.data?.attributes?.alternativeText || "Article image"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {categoryName && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                {categoryName}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <CardContent className="flex-1 flex flex-col justify-between p-6">
                        <div>
                          <CardTitle className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                            {article.attributes.title}
                          </CardTitle>
                          {(article.attributes.description || article.attributes.excerpt) && (
                            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                              {article.attributes.description || article.attributes.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
                          Read More
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
            
            {/* View More Articles Link */}
            <div className="text-center mt-8">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                View All Articles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
