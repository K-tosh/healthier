import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/app/[lang]/utils/api-helpers";
import { getReadingTime } from "@/app/[lang]/utils/article-utils";
import Image from "next/image";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    articles: {
      data: Array<{}>;
    };
  };
}

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
  };
}

function selectedFilter(current: string, selected: string) {
  return current === selected
    ? "medical-badge medical-badge-blue"
    : "medical-badge bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600";
}

export default function ArticleSelect({
  categories,
  articles,
  params,
}: {
  categories: Category[];
  articles: Article[];
  params: {
    slug: string;
    category: string;
  };
}) {

  return (
    <div className="space-y-6">
      {/* Category Tags */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-3">Browse by Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category: Category) => {
            if (category.attributes.articles.data.length === 0) return null;
            return (
              <Link
                key={category.id}
                href={`/blog/${category.attributes.slug}`}
                className={selectedFilter(
                  category.attributes.slug,
                  params.category
                )}
              >
                {category.attributes.name}
              </Link>
            );
          })}
          <Link 
            href={"/blog"} 
            className={selectedFilter("", "filter")}
          >
            All Articles
          </Link>
        </div>
      </div>

      {/* Related Articles */}
      {articles.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-3">Related Articles</h4>
          <div className="space-y-4">
            {articles.slice(0, 4).map((article: Article) => {
              const isCurrentArticle = params.slug === article.attributes.slug;
              const categorySlug = article.attributes.category?.data?.attributes?.slug || params.category;
              const imageUrl = getStrapiMedia(article.attributes.cover?.data?.attributes?.url || null);
              
              if (isCurrentArticle) return null; // Skip current article

              return (
                <Link
                  key={article.id}
                  href={`/blog/${categorySlug}/${article.attributes.slug}`}
                  className="group block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-blue-50"
                >
                  <div className="flex gap-3">
                    {imageUrl && (
                      <div className="flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={article.attributes.title}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-relaxed mb-1">
                        {article.attributes.title}
                      </h5>
                      {article.attributes.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                          {article.attributes.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.attributes.publishedAt)}
                        </span>
                        {article.attributes.category?.data?.attributes?.name && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {article.attributes.category.data.attributes.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* View More Link */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
