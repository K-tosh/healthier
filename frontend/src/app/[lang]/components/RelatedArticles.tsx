"use client";
import React from "react";
import { BlogCardVertical } from "./BlogCardVertical";

interface RelatedArticlesProps {
  heading: string;
  sub_heading?: string;
  articles: any[];
  locale: string;
}

export const RelatedArticles = ({ 
  heading, 
  sub_heading, 
  articles, 
  locale 
}: RelatedArticlesProps) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="healthier-section healthier-section-light">
      <div className="healthier-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="healthier-section-heading text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {heading}
            </h2>
            {sub_heading && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {sub_heading}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((article, index) => (
              <BlogCardVertical 
                key={article.id || article.attributes?.slug || index} 
                article={article} 
                locale={locale} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
