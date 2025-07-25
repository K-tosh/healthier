import type { Metadata } from "next";
import { fetchAPI } from "../utils/fetch-api";
import componentResolver from "../utils/component-resolver";
import { getStrapiMedia } from "../utils/api-helpers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "../components/PageHeader";
import FeaturedContent from "../components/FeaturedContent";

interface Props {
  params: { lang: string };
}

interface Article {
  id: number;
  title: string;
  description?: string;
  slug: string;
  cover?: {
    url?: string;
    alternativeText?: string;
    name?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
}

interface Condition {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

async function getPageData(slug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  
  try {
    const path = `/pages`;
    const urlParamsObject = {
      filters: { slug },
      populate: {
        contentSections: {
          populate: {
            // Populate articles relation in any content section
            articles: {
              populate: ["cover", "category"]
            },
            // Populate conditions relation in any content section  
            conditions: {
              populate: "*"
            },
            // Populate other standard fields
            "*": true
          }
        },
        seo: {
          populate: "*"
        }
      }
    };
    const { data } = await fetchAPI(path, urlParamsObject, token);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

// Also fetch articles by category as fallback
async function getCategoryArticles(categorySlug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  
  try {
    const path = `/articles`;
    const urlParamsObject = {
      filters: {
        category: {
          slug: {
            $eq: categorySlug
          }
        }
      },
      populate: ["cover", "category"],
      pagination: {
        limit: 12
      },
      sort: ["createdAt:desc"]
    };
    const { data } = await fetchAPI(path, urlParamsObject, token);
    return data || [];
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageData("diseases-and-conditions");
  
  if (!page) {
    return {
      title: "Diseases & Conditions",
      description: "Learn about common diseases and medical conditions"
    };
  }

  const { seo } = page.attributes;
  const metadata: Metadata = {
    title: seo?.metaTitle || "Diseases & Conditions",
    description: seo?.metaDescription || "Learn about common diseases and medical conditions",
  };

  return metadata;
}

export default async function DiseasesConditionsPage({ params }: Props) {
  const page = await getPageData("diseases-and-conditions");
  
  // Get fallback articles from the category
  const categoryArticles = await getCategoryArticles("diseases-and-conditions");

  if (!page) {
    // If no page exists, show a default layout with category articles
    return (
      <main>
        <PageHeader 
          heading="Diseases & Conditions" 
          text="Learn about common diseases and medical conditions affecting people in Kenya and across Africa."
        />
        
        {/* Show featured content when no page sections exist */}
        <FeaturedContent data={{
          heading: "Featured Health Content",
          description: "Essential information about common diseases and conditions in Kenya",
          featuredArticles: {
            data: categoryArticles.slice(0, 3).map((article: Article) => ({
              id: article.id,
              title: article.title,
              slug: article.slug,
              description: article.description,
              cover: article.cover,
              category: article.category
            }))
          },
          featuredConditions: {
            data: [
              { id: 8, name: "Hypertension", slug: "hypertension" },
              { id: 22, name: "Diabetes Mellitus", slug: "diabetis-mellitus" },
              { id: 4, name: "Malaria", slug: "malaria" },
              { id: 19, name: "Asthma", slug: "asthma" }
            ]
          },
          showAllArticlesButton: true,
          allArticlesButtonText: "View All Articles",
          allArticlesButtonUrl: "/blog"
        }} />
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-gray-600">
                Explore our collection of articles about diseases and conditions
              </p>
            </div>
            
            {categoryArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.map((article: Article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.category?.slug || 'general'}/${article.slug}`}
                    className="group block"
                  >
                    <Card className="h-full flex flex-col medical-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {article.cover?.url && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={getStrapiMedia(article.cover.url) || undefined}
                            alt={article.cover.alternativeText || article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {article.category && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-blue-600 text-white">
                                {article.category.name}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        {article.description && (
                          <p className="text-gray-600 line-clamp-3 leading-relaxed">
                            {article.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No articles found for this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  const { contentSections } = page.attributes;

  return (
    <main>
      {/* Add Featured Content section if none exists */}
      {(!contentSections || !contentSections.some((section: any) => section.__component === 'sections.featured-content')) && (
        <FeaturedContent data={{
          heading: "Featured Health Content",
          description: "Essential information about common diseases and conditions in Kenya",
          featuredArticles: {
            data: categoryArticles.slice(0, 3).map((article: Article) => ({
              id: article.id,
              title: article.title,
              slug: article.slug,
              description: article.description,
              cover: article.cover,
              category: article.category
            }))
          },
          featuredConditions: {
            data: [
              { id: 8, name: "Hypertension", slug: "hypertension" },
              { id: 22, name: "Diabetes Mellitus", slug: "diabetis-mellitus" },
              { id: 4, name: "Malaria", slug: "malaria" },
              { id: 19, name: "Asthma", slug: "asthma" }
            ]
          },
          showAllArticlesButton: true,
          allArticlesButtonText: "View All Articles",
          allArticlesButtonUrl: "/blog"
        }} />
      )}

      {contentSections && contentSections.map((section: any, index: number) => {
        console.log(`🔧 Section ${index}:`, section.__component);
        console.log(`📰 Articles in section:`, section.articles);
        console.log(`🏥 Conditions in section:`, section.conditions);
        
        return componentResolver(section, index);
      })}
      
      {/* Fallback: Show category articles if no content sections have articles */}
      {(!contentSections || !contentSections.some((section: any) => section.articles?.length > 0)) && categoryArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Related Articles
              </h2>
              <p className="text-lg text-gray-600">
                Browse articles about diseases and conditions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.slice(0, 6).map((article: Article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.category?.slug || 'general'}/${article.slug}`}
                  className="group block"
                >
                  <Card className="h-full flex flex-col medical-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {article.cover?.url && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={getStrapiMedia(article.cover.url) ?? undefined}
                          alt={article.cover.alternativeText || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 leading-tight text-lg">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {article.description && (
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {article.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
