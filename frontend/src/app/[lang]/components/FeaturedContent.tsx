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
    <section className="healthier-section">
      <div className="content-container">
        {/* Header */}
        <div className="healthier-section-header">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h2 className="healthier-section-title">
                {heading}
              </h2>
              <div className="healthier-section-divider-line"></div>
            </div>
          </div>
          {description && (
            <p className="healthier-section-subtitle">
              {description}
            </p>
          )}
        </div>

        {/* Featured Conditions */}
        {validConditions.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="medical-subheading text-3xl">Featured Health Conditions</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {validConditions.map((condition: Condition) => {
                const conditionData = getConditionData(condition);
                return (
                  <Link
                    key={condition.id}
                    href={`/conditions/${conditionData.slug}`}
                    className="medical-badge medical-badge-blue hover:shadow-lg font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
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
            <div className="flex items-center justify-center mb-12">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="medical-subheading text-3xl">Featured Articles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {validArticles.map((article: Article) => {
                const articleData = getArticleData(article);
                const imageUrl = getImageUrl(article);
                
                return (
                  <Link
                    key={article.id}
                    href={`/blog/${articleData.categorySlug || 'general'}/${articleData.slug}`}
                    className="group block transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <Card className="h-full flex flex-col healthier-card-feature hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                      {imageUrl && (
                        <div className="relative h-52 w-full overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={articleData.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          {articleData.categoryName && (
                            <div className="absolute top-4 left-4">
                              <Badge variant="medical" className="shadow-lg">
                                {articleData.categoryName}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="group-hover:text-blue-600 transition-colors duration-300 leading-tight text-lg">
                          {articleData.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        {articleData.description && (
                          <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                            {articleData.description}
                          </p>
                        )}
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800 transition-colors duration-300">
                          <span>Read More</span>
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

            {/* View All Button */}
            {showButton && (
              <div className="text-center mt-12">
                <Link 
                  href={buttonUrl}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {buttonText}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
