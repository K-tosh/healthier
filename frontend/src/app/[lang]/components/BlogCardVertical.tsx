"use client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate, getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { getReadingTime } from "@/app/[lang]/utils/article-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description?: string;
    publishedAt: string;
    cover?: {
      data?: {
        attributes: {
          url: string;
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
    blocks?: any[];
  };
}

interface BlogCardVerticalProps {
  article: Article;
  locale: string;
}

export const BlogCardVertical = ({ article, locale }: BlogCardVerticalProps) => {
  const { title, slug, description, publishedAt, cover, category, blocks } = article.attributes;
  const imageUrl = getStrapiMedia(cover?.data?.attributes?.url || null);
  const categoryName = category?.data?.attributes?.name;
  const categorySlug = category?.data?.attributes?.slug;
  
  // Calculate reading time from blocks
  const richTextBlock = blocks?.find((b: any) => b.__component === 'shared.rich-text');
  const markdown = richTextBlock?.body || '';
  const readingTime = getReadingTime(markdown);

  return (
    <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300">
      <Link href={`/${locale}/blog/${categorySlug || 'health'}/${slug}`} className="block h-full">
        {/* Image */}
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {categoryName && (
              <div className="absolute top-3 left-3">
                <Badge className="medical-badge medical-badge-primary bg-white/90 text-blue-600 border-blue-200">
                  {categoryName}
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex-1">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight mb-3">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                {description}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(publishedAt)}
                </span>
                {readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readingTime} min read
                  </span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
