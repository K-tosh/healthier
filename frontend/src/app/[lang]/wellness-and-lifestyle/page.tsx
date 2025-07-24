import type { Metadata } from "next";
import { fetchAPI } from "../utils/fetch-api";
import componentResolver from "../utils/component-resolver";

interface Props {
  params: { lang: string };
}

async function getPageData(slug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  
  try {
    const path = `/pages`;
    const urlParamsObject = {
      filters: { slug },
      populate: "deep"
    };
    const { data } = await fetchAPI(path, urlParamsObject, token);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageData("wellness-and-lifestyle");
  
  if (!page) {
    return {
      title: "Wellness & Lifestyle",
      description: "Health tips and lifestyle guidance"
    };
  }

  const { seo } = page.attributes;
  const metadata: Metadata = {
    title: seo?.metaTitle || "Wellness & Lifestyle",
    description: seo?.metaDescription || "Health tips and lifestyle guidance",
  };

  return metadata;
}

export default async function WellnessAndLifestylePage({ params }: Props) {
  const page = await getPageData("wellness-and-lifestyle");

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600">
          Please create a page with slug "wellness-and-lifestyle" in Strapi admin.
        </p>
      </div>
    );
  }

  const { contentSections } = page.attributes;

  return (
    <main>
      {contentSections && contentSections.map((section: any, index: number) => 
        componentResolver(section, index)
      )}
    </main>
  );
}
