import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/app/[lang]/components/PageHeader";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles: Array<{
    id: number;
    title: string;
    description: string;
    slug: string;
  }>;
}

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  "diseases-and-conditions": "🦠",
  "symptoms-and-diagnosis": "🩺", 
  "drugs-and-medications": "💊",
  "wellness-and-lifestyle": "🧘",
  "maternal-and-child-health": "👶",
  "infectious-diseases": "🔬"
};

async function getCategories(): Promise<Category[]> {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/categories`;
    const urlParamsObject = {
      populate: {
        articles: {
          fields: ["title", "description", "slug"]
        }
      }
    };
    
    const { data } = await fetchAPI(path, urlParamsObject, token);
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        heading="Health Topics" 
        text="Explore comprehensive health information organized by medical specialties and topics"
      />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="h-full medical-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-3xl group-hover:bg-blue-200 transition-colors duration-200">
                      {categoryIcons[category.slug] || "📋"}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-200">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {category.description}
                    </p>
                    {category.articles && category.articles.length > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {category.articles.length} article{category.articles.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    <div className="mt-4 flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-800">
                      Explore Topics
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export const revalidate = 60; // Revalidate every minute
