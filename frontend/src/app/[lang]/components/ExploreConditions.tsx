// ExploreConditions.tsx
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";


// Define types for conditions and articles
interface Condition {
  name: string;
  slug?: string;
}

interface Article {
  id: string | number;
  attributes: {
    slug: string;
    title: string;
    excerpt?: string;
    cover?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
  };
}

interface ExploreConditionsProps {
  data: {
    heading: string;
    conditions: Condition[] | { data: Condition[] };
    articles?: { data: Article[] };
  };
}

export default function ExploreConditions({ data }: ExploreConditionsProps) {
  // Support both array and object-with-data for conditions
  const conditionsArray: Condition[] = Array.isArray(data.conditions)
    ? data.conditions
    : (data.conditions as { data: Condition[] })?.data || [];
  const articlesArray: Article[] = data.articles?.data || [];
  console.log("🩺 ExploreConditions Data:", data);

  if (!data || !conditionsArray.length) {
    return <div className="text-gray-400">No conditions available</div>;
  }

  return (
    <section className="py-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
            {data.heading}
          </h2>
          <Link href="/conditions" className="text-blue-700 font-semibold text-sm hover:underline flex items-center gap-1">
            SEE ALL HEALTH CONDITIONS <span aria-hidden>→</span>
          </Link>
        </div>
        {/* Condition Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {conditionsArray.map((condition: Condition, index: number) => (
            <Link
              key={index}
              href={condition.slug ? `/conditions/${condition.slug}` : "#"}
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-full text-sm transition shadow-sm"
            >
              {condition.name}
            </Link>
          ))}
        </div>
        <hr className="my-6" />
        {/* Featured Articles Grid */}
        {articlesArray.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesArray.map((article: Article) => {
              const imageUrl = article.attributes.cover?.data ? article.attributes.cover.data.attributes.url : null;
              return (
                <Card key={article.id} className="h-full flex flex-col">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={article.attributes.cover?.data?.attributes.alternativeText || "Article image"}
                      className="w-full h-48 object-cover rounded-t-lg mb-2"
                    />
                  )}
                  <CardContent className="flex-1 flex flex-col justify-between p-4">
                    <CardTitle className="text-lg font-semibold font-sans mb-2">
                      <Link href={`/articles/${article.attributes.slug}`} className="hover:underline text-gray-900 dark:text-white">
                        {article.attributes.title}
                      </Link>
                    </CardTitle>
                    {article.attributes.excerpt && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-3 font-serif">
                        {article.attributes.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
  