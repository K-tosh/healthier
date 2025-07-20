import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    cover: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
        };
      };
    };
  };
}

interface TrendingArticleProps {
  data: {
    heading: string;
    articles: {
      data: Article[];
    };
  };
}

export default function TrendingArticle({ data }: TrendingArticleProps) {
  const articlesArray = data.articles?.data || [];

  if (!articlesArray.length) return null;

  const [mainArticle, ...otherArticles] = articlesArray;

  const mainImageUrl = getStrapiMedia(mainArticle.attributes.cover.data.attributes.url);

  return (
    <section className="bg-white dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-gray-900 dark:text-white font-sans">
          {data.heading}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Article */}
          <Link
            href={`/blog/${mainArticle.attributes.slug}`}
            className="group block h-full"
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-72 w-full">
                {mainImageUrl ? (
                  <Image
                    src={mainImageUrl}
                    alt={mainArticle.attributes.cover.data.attributes.alternativeText || "Article image"}
                    fill
                    className="object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full rounded-t-xl" />
                )}
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-sans">
                  {mainArticle.attributes.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="prose prose-sm font-serif text-gray-700 dark:text-gray-300 line-clamp-3">
                  {mainArticle.attributes.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
          {/* Other Articles */}
          <div className="grid gap-6">
            {otherArticles.map((article) => {
              const otherImageUrl = getStrapiMedia(article.attributes.cover.data.attributes.url);
              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.attributes.slug}`}
                  className="block"
                >
                  <Card className="flex items-center gap-4 p-2 hover:shadow-md transition">
                    <div className="relative w-24 h-20 flex-shrink-0">
                      {otherImageUrl ? (
                        <Image
                          src={otherImageUrl}
                          alt={article.attributes.cover.data.attributes.alternativeText || "Thumbnail"}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full rounded" />
                      )}
                    </div>
                    <CardContent className="p-0">
                      <CardTitle className="text-base font-semibold font-sans line-clamp-2">
                        {article.attributes.title}
                      </CardTitle>
                    </CardContent>
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
