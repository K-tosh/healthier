import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          <div className="space-y-3">
            {articles.slice(0, 5).map((article: Article) => {
              const isCurrentArticle = params.slug === article.attributes.slug;
              return (
                <Link
                  key={article.id}
                  href={`/blog/${params.category}/${article.attributes.slug}`}
                  className={`group block p-3 rounded-lg transition-all duration-200 ${
                    isCurrentArticle 
                      ? "bg-blue-50 border border-blue-200" 
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h5 className={`text-sm font-medium leading-relaxed ${
                      isCurrentArticle 
                        ? "text-blue-700" 
                        : "text-gray-900 group-hover:text-blue-600"
                    } transition-colors duration-200 line-clamp-2`}>
                      {article.attributes.title}
                    </h5>
                    <ArrowRight className={`w-4 h-4 ml-2 flex-shrink-0 ${
                      isCurrentArticle 
                        ? "text-blue-600" 
                        : "text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1"
                    } transition-all duration-200`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
