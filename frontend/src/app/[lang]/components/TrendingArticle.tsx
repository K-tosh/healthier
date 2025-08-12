"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { useState, useEffect } from "react";

interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// Strapi v5 Article format (direct properties, no attributes wrapper)
interface Article {
  id: number;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  cover?: StrapiImage;
  category?: StrapiCategory;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

interface TrendingArticleProps {
  data: {
    id?: number;
    heading?: string;
    description?: string;
    articles?: {
      data: any[];
    };
  };
}

export default function TrendingArticle({ data }: TrendingArticleProps) {
  // Use the manually selected articles from Strapi with proper structure access
  const articles = Array.isArray(data.articles?.data) ? data.articles.data : [];
  
  // Filter out any invalid articles
  const validArticles = articles.filter(article => {
    return article && article.attributes && article.attributes.title && article.attributes.slug;
  });
  
  // Return null if no valid articles
  if (!validArticles.length) {
    console.warn("🚨 TrendingArticle: No valid articles found");
    return null;
  }

  const [mainArticle, ...otherArticles] = validArticles;

  // Helper function to get image URL with null safety for Strapi structure
  const getImageUrl = (article: any) => {
    const cover = article.attributes?.cover?.data?.attributes;
    if (cover?.url) {
      return getStrapiMedia(cover.url);
    }
    return null;
  };

  // Helper function to get alt text with null safety for Strapi structure
  const getAltText = (article: any) => {
    const cover = article.attributes?.cover?.data?.attributes;
    if (cover?.alternativeText) {
      return cover.alternativeText;
    } else if (cover?.name) {
      return cover.name;
    }
    return "Article image";
  };

  // Helper function to get article data with null safety for Strapi structure
  const getArticleData = (article: any) => {
    const attrs = article.attributes;
    return {
      title: attrs?.title || "",
      slug: attrs?.slug || "",
      description: attrs?.description || attrs?.excerpt || "",
      categoryName: attrs?.category?.data?.attributes?.name,
      categorySlug: attrs?.category?.data?.attributes?.slug
    };
  };

  const mainImageUrl = getImageUrl(mainArticle);
  const mainAltText = getAltText(mainArticle);
  const mainData = getArticleData(mainArticle);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {data.heading || "Trending Health Topics"}
          </h2>
          {data.description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {data.description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Article */}
          <Link
            href={`/blog/${mainData.categorySlug || 'general'}/${mainData.slug}`}
            className="group block h-full"
          >
            <Card className="h-full flex flex-col medical-card hover:shadow-lg transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                {mainImageUrl ? (
                  <Image
                    src={mainImageUrl}
                    alt={mainAltText}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-2-3H9m12 0a2 2 0 012 2v8a2 2 0 01-2 2h-2m-2-3v3m0 0h3m-3 0h-3" />
                    </svg>
                  </div>
                )}
                {/* Category Badge */}
                {mainData.categoryName && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                      {mainData.categoryName}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                  {mainData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {mainData.description}
                </p>
              </CardContent>
            </Card>
          </Link>
          
          {/* Other Articles */}
          <div className="space-y-4">
            {otherArticles.slice(0, 4).map((article) => {
              const otherImageUrl = getImageUrl(article);
              const otherAltText = getAltText(article);
              const otherData = getArticleData(article);
              
              return (
                <Link
                  key={article.id}
                  href={`/blog/${otherData.categorySlug || 'general'}/${otherData.slug}`}
                  className="group block"
                >
                  <Card className="flex items-start gap-4 p-4 medical-card hover:shadow-md transition-all duration-200">
                    <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                      {otherImageUrl ? (
                        <Image
                          src={otherImageUrl}
                          alt={otherAltText}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
                          {otherData.title}
                        </h3>
                        {otherData.categoryName && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0">
                            {otherData.categoryName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {otherData.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
