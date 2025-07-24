// ExploreConditions.tsx
"use client";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { useState, useEffect } from "react";

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
    cover?: any; // Use any for flexible cover structure
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

interface ExploreConditionsProps {
  data: {
    heading?: string;
    description?: string;
    conditions?: Condition[] | { data: Condition[] };
    articles?: { data: Article[] };
    categories?: { data: Condition[] };
  };
}

export default function ExploreConditions({ data }: ExploreConditionsProps) {
  console.log("🩺 ExploreConditions Data:", data);
  console.log("📰 Articles field:", data.articles);
  console.log("📰 Articles data array:", data.articles?.data);
  console.log("📰 Articles length:", data.articles?.data?.length);
  
  // State for fetched articles
  const [fetchedArticles, setFetchedArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  // Handle different data structures for conditions/categories
  let conditionsArray: Condition[] = [];
  
  if (data.conditions) {
    conditionsArray = Array.isArray(data.conditions) 
      ? data.conditions 
      : data.conditions.data || [];
  } else if (data.categories) {
    conditionsArray = data.categories.data || [];
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
    console.log("🩺 ExploreConditions: Using fallback conditions");
  }

  // Fetch articles related to health conditions
  useEffect(() => {
    // Only fetch articles automatically if none are provided via Strapi relation
    if (data.articles?.data && data.articles.data.length > 0) {
      console.log("✅ Using articles from Strapi relation:", data.articles.data.length);
      setFetchedArticles([]); // Clear any previously fetched articles
      return;
    }

    const fetchArticles = async () => {
      setIsLoadingArticles(true);
      try {
        console.log("🔄 No articles in relation, fetching recent articles...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*&pagination[limit]=3&sort=createdAt:desc`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          }
        );
        
        console.log("� Article fetch response status:", response.status);
        
        if (response.ok) {
          const result = await response.json();
          
          // Debug: Log the actual article structure
          console.log("📊 Article API response:", result);
          if (result.data && result.data.length > 0) {
            console.log("📄 First article structure:", result.data[0]);
          }
          
          setFetchedArticles(result.data || []);
          console.log("✅ ExploreConditions: Fetched", result.data?.length || 0, "fallback articles");
        } else {
          console.error("❌ Failed to fetch articles:", response.statusText);
          // Try to get error details
          const errorText = await response.text();
          console.error("❌ Error details:", errorText);
        }
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [data.articles]);

  // Prioritize articles from Strapi relation, fallback to fetched articles
  const articlesArray: Article[] = (data.articles?.data && data.articles.data.length > 0) 
    ? data.articles.data 
    : fetchedArticles;
  
  // Filter out any invalid articles - handle both v4 and v5 formats
  const validArticles = articlesArray.filter(article => {
    if (!article) return false;
    
    // Handle both Strapi v4 format (with attributes) and v5 format (direct properties)
    const articleData = article.attributes || article;
    return articleData && articleData.title && articleData.slug;
  });
  
  console.log("📰 Valid articles count:", validArticles.length);
  console.log("📄 Sample article for debugging:", articlesArray[0]);
  
  const heading = data.heading || "Explore Health Conditions";
  const description = data.description;

  if (!data) {
    console.warn("🚨 ExploreConditions: No data provided");
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
        {(validArticles.length > 0 || isLoadingArticles) && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Health Articles</h3>
            
            {/* Loading State */}
            {isLoadingArticles && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="animate-pulse">
                    <Card className="h-full flex flex-col medical-card overflow-hidden">
                      <div className="h-48 w-full bg-gray-200"></div>
                      <CardContent className="flex-1 flex flex-col justify-between p-6">
                        <div>
                          <div className="h-6 bg-gray-200 rounded mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            
            {/* Articles Grid */}
            {!isLoadingArticles && validArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validArticles.slice(0, 3).map((article: Article) => {
                // Handle different cover data structures with proper null checking
                let imageUrl = null;
                let altText = "Article image";
                
                // Ensure article exists
                if (!article) {
                  console.warn("Article missing:", article);
                  return null;
                }
                
                // Handle both Strapi v4 format (with attributes) and v5 format (direct properties)
                const articleData = article.attributes || article;
                
                // Handle cover image - Strapi v5 has cover directly
                if (articleData.cover?.url) {
                  imageUrl = getStrapiMedia(articleData.cover.url);
                  altText = articleData.cover.alternativeText || articleData.cover.name || altText;
                } else if (articleData.cover?.data?.attributes?.url) {
                  // Fallback for v4 format
                  imageUrl = getStrapiMedia(articleData.cover.data.attributes.url);
                  altText = articleData.cover.data.attributes.alternativeText || altText;
                }
                
                // Handle category - adjust for v5 format
                const categoryName = (articleData.category as any)?.name || articleData.category?.data?.attributes?.name;
                const categorySlug = (articleData.category as any)?.slug || articleData.category?.data?.attributes?.slug;
                  
                  return (
                    <Link
                      key={article.id}
                      href={`/blog/${categorySlug || 'general'}/${articleData.slug}`}
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
                              {articleData.title}
                            </CardTitle>
                            {(articleData.description || articleData.excerpt) && (
                              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                {articleData.description || articleData.excerpt}
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
            )}
            
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

        {/* Empty State - only show if no conditions and no articles and not loading */}
        {conditionsArray.length === 0 && validArticles.length === 0 && !isLoadingArticles && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-2-3H9m12 0a2 2 0 012 2v8a2 2 0 01-2 2h-2m-2-3v3m0 0h3m-3 0h-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
            <p className="text-gray-500">Health conditions and articles will appear here when added.</p>
          </div>
        )}
      </div>
    </section>
  );
}
  