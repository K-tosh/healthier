import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia, formatDate } from "../utils/api-helpers";
import { Clock, User, Calendar, ArrowRight } from "lucide-react";

interface Article {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    articleType?: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    authorsBio: {
      data: {
        attributes: {
          name: string;
          avatar: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
  };
}

interface Condition {
  name: string;
  description?: string;
  isEmergency: boolean;
  prevalenceInKenya?: string;
}

// Map article types to display names and colors
const getArticleTypeInfo = (articleType: string) => {
  const typeMap: { [key: string]: { name: string; color: string } } = {
    overview: { name: "Overview", color: "medical-badge-blue" },
    symptoms: { name: "Symptoms", color: "medical-badge-red" },
    treatment: { name: "Treatment", color: "medical-badge-green" },
    prevention: { name: "Prevention", color: "medical-badge-purple" },
    lifestyle: { name: "Lifestyle", color: "medical-badge-orange" },
    emergency: { name: "Emergency", color: "medical-badge-red" },
    general: { name: "General", color: "medical-badge-gray" },
  };
  
  return typeMap[articleType] || { name: articleType || "Article", color: "medical-badge-gray" };
};

export default function ConditionArticleList({
  data: articles,
  condition,
  children,
}: {
  data: Article[];
  condition: Condition;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Featured Article */}
      {articles.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
          {(() => {
            const featuredArticle = articles[0];
            const imageUrl = getStrapiMedia(
              featuredArticle.attributes.cover.data?.attributes.url
            );
            const category = featuredArticle.attributes.category.data?.attributes;
            const authorsBio = featuredArticle.attributes.authorsBio.data?.attributes;
            const avatarUrl = getStrapiMedia(
              authorsBio?.avatar.data.attributes.url
            );
            const articleType = featuredArticle.attributes.articleType;
            const typeInfo = getArticleTypeInfo(articleType || 'general');

            return (
              <Link
                href={`/blog/${category?.slug}/${featuredArticle.attributes.slug}`}
                className="medical-card group block overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative">
                    {imageUrl && (
                      <Image
                        alt={featuredArticle.attributes.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-80 md:h-full"
                        src={imageUrl}
                      />
                    )}
                    <div className="absolute top-4 left-4 space-y-2">
                      {category && (
                        <span className="medical-badge medical-badge-blue">
                          {category.name}
                        </span>
                      )}
                      <span className={`medical-badge ${typeInfo.color}`}>
                        {typeInfo.name}
                      </span>
                    </div>
                    {condition.isEmergency && (
                      <div className="absolute top-4 right-4">
                        <span className="medical-badge medical-badge-red">
                          Emergency
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                      {featuredArticle.attributes.title}
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                      {featuredArticle.attributes.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        {avatarUrl && (
                          <Image
                            alt="author avatar"
                            width={48}
                            height={48}
                            src={avatarUrl}
                            className="rounded-full object-cover"
                          />
                        )}
                        <div>
                          {authorsBio && (
                            <p className="font-semibold text-gray-900">{authorsBio.name}</p>
                          )}
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(featuredArticle.attributes.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-800 transition-colors duration-200">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()}
        </div>
      )}

      {/* Articles Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          All {condition.name} Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => {
            const imageUrl = getStrapiMedia(
              article.attributes.cover.data?.attributes.url
            );

            const category = article.attributes.category.data?.attributes;
            const authorsBio = article.attributes.authorsBio.data?.attributes;
            const avatarUrl = getStrapiMedia(
              authorsBio?.avatar.data.attributes.url
            );
            const articleType = article.attributes.articleType;
            const typeInfo = getArticleTypeInfo(articleType || 'general');

            return (
              <Link
                href={`/blog/${category?.slug}/${article.attributes.slug}`}
                key={article.id}
                className="medical-card group block overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative">
                  {imageUrl && (
                    <Image
                      alt={article.attributes.title}
                      width={400}
                      height={240}
                      className="object-cover w-full h-48"
                      src={imageUrl}
                    />
                  )}
                  <div className="absolute top-3 left-3 space-y-1">
                    {category && (
                      <span className="medical-badge medical-badge-blue text-xs">
                        {category.name}
                      </span>
                    )}
                    <span className={`medical-badge ${typeInfo.color} text-xs`}>
                      {typeInfo.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {article.attributes.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.attributes.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {avatarUrl && (
                        <Image
                          alt="author avatar"
                          width={32}
                          height={32}
                          src={avatarUrl}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        {authorsBio && (
                          <p className="text-sm font-semibold text-gray-900">{authorsBio.name}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(article.attributes.publishedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {children && children}
    </div>
  );
}