"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface Article {
  id: string | number;
  attributes?: {
    title: string;
    slug: string;
    description?: string;
    excerpt?: string;
    cover?: any;
    category?: {
      data?: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
  };
  // Handle Strapi v5 format
  title?: string;
  slug?: string;
  description?: string;
  excerpt?: string;
  cover?: any;
  category?: any;
}

interface Condition {
  id: string | number;
  attributes?: {
    name: string;
    slug: string;
    description?: string;
  };
  // Handle Strapi v5 format
  name?: string;
  slug?: string;
  description?: string;
}

interface FeaturedContentProps {
  data: {
    heading?: string;
    description?: string;
    featuredArticles?: {
      data: Article[];
    };
    featuredConditions?: {
      data: Condition[];
    };
    showAllArticlesButton?: boolean;
    allArticlesButtonText?: string;
    allArticlesButtonUrl?: string;
  };
}

export default function FeaturedContent({ data }: FeaturedContentProps) {
  console.log("🌟 FeaturedContent Data:", data);
  console.log("📰 Featured Articles:", data.featuredArticles);
  console.log("🏥 Featured Conditions:", data.featuredConditions);

  const heading = data.heading || "Featured Content";
  const description = data.description;
  const showButton = data.showAllArticlesButton !== false;
  const buttonText = data.allArticlesButtonText || "View All Articles";
  const buttonUrl = data.allArticlesButtonUrl || "/blog";

  // Process articles
  const articlesArray = data.featuredArticles?.data || [];
  const validArticles = articlesArray.filter(article => {
    const articleData = article.attributes || article;
    return articleData && articleData.title && articleData.slug;
  });

  // Process conditions
  const conditionsArray = data.featuredConditions?.data || [];
  const validConditions = conditionsArray.filter(condition => {
    const conditionData = condition.attributes || condition;
    return conditionData && conditionData.name && conditionData.slug;
  });

  // Helper functions for safe data access
  const getArticleData = (article: Article) => {
    const articleData = article.attributes || article;
    return {
      title: articleData.title,
      slug: articleData.slug,
      description: articleData.description || articleData.excerpt || "",
      categoryName: (articleData.category as any)?.name || articleData.category?.data?.attributes?.name,
      categorySlug: (articleData.category as any)?.slug || articleData.category?.data?.attributes?.slug
    };
  };

  const getImageUrl = (article: Article) => {
    const articleData = article.attributes || article;
    if (articleData.cover?.url) {
      return getStrapiMedia(articleData.cover.url);
    } else if (articleData.cover?.data?.attributes?.url) {
      return getStrapiMedia(articleData.cover.data.attributes.url);
    }
    return null;
  };

  const getConditionData = (condition: Condition) => {
    const conditionData = condition.attributes || condition;
    return {
      name: conditionData.name,
      slug: conditionData.slug,
      description: conditionData.description || ""
    };
  };

  if (validArticles.length === 0 && validConditions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
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

        {/* Featured Conditions */}
        {validConditions.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Health Conditions</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {validConditions.map((condition: Condition) => {
                const conditionData = getConditionData(condition);
                return (
                  <Link
                    key={condition.id}
                    href={`/conditions/${conditionData.slug}`}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200"
                  >
                    {conditionData.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured Articles */}
        {validArticles.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validArticles.map((article: Article) => {
                const articleData = getArticleData(article);
                const imageUrl = getImageUrl(article);
                
                return (
                  <Link
                    key={article.id}
                    href={`/blog/${articleData.categorySlug || 'general'}/${articleData.slug}`}
                    className="group block"
                  >
                    <Card className="h-full flex flex-col medical-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={articleData.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {articleData.categoryName && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-blue-600 text-white">
                                {articleData.categoryName}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {articleData.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        {articleData.description && (
                          <p className="text-gray-600 line-clamp-3 leading-relaxed">
                            {articleData.description}
                          </p>
                        )}
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

            {/* View All Button */}
            {showButton && (
              <div className="text-center mt-8">
                <Link 
                  href={buttonUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {buttonText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
