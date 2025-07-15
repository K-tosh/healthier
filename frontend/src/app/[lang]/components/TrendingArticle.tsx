import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    image: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
        };
      };
    };
  };
}

interface TrendingProps {
  data: {
    heading: string;
    articles: Article[];
  };
}

export default function Trending({ data }: TrendingProps) {
  const [featured, ...rest] = data.articles;

  return (
    <section className="py-12 bg-neutral-50 dark:bg-black dark:text-white">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-bold mb-6">{data.heading}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured article on the left */}
          {featured && (
            <div className="lg:col-span-2">
              <Link href={`/article/${featured.attributes.slug}`}>
                <div className="relative h-80 rounded-lg overflow-hidden group">
                  <Image
                    src={getStrapiMedia(featured.attributes.image.data.attributes.url) || ""}
                    alt={featured.attributes.image.data.attributes.alternativeText || "Article"}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                    <h3 className="text-white text-2xl font-semibold">
                      {featured.attributes.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Remaining 3 smaller articles on the right */}
          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((article) => (
              <Link key={article.id} href={`/article/${article.attributes.slug}`}>
                <div className="flex gap-4 items-center hover:opacity-90 transition">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={getStrapiMedia(article.attributes.image.data.attributes.url) || ""}
                      alt={article.attributes.image.data.attributes.alternativeText || "Thumbnail"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-base font-medium">{article.attributes.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
