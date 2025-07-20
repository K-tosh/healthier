import {Metadata} from "next";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";
import { Card, CardContent } from "@/components/ui/card";
import TrendingArticle from "@/app/[lang]/components/TrendingArticle";


type Props = {
    params: {
        lang: string,
        slug: string
    }
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.slug, params.lang);

    if (!page.data[0]?.attributes?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].attributes.seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}


export default async function PageRoute({params}: Props) {
    const page = await getPageBySlug(params.slug, params.lang);
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].attributes.contentSections;
    // Example data for sidebar and author info (replace with real data as needed)
    const relatedArticles = {
      heading: "Related Articles",
      articles: [] // Populate with related articles data
    };
    const authorInfo = {
      name: "Jane Doe",
      bio: "Health journalist and editor.",
      date: "April 2024"
    };
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4">
              {contentSections.map((section: any, index: number) => componentResolver(section, index))}
              {/* CTA/Banner Example */}
              <div className="mt-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="py-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Subscribe for Health Updates</h3>
                    <p className="text-gray-700 mb-4">Get the latest health news and tips delivered to your inbox.</p>
                    <button className="inline-block px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">Subscribe</button>
                  </CardContent>
                </Card>
              </div>
              {/* Author/Source Info Example */}
              <div className="text-sm text-gray-600 mt-8 border-t pt-4">
                <div><span className="font-semibold">By {authorInfo.name}</span> &middot; {authorInfo.date}</div>
                <div>{authorInfo.bio}</div>
              </div>
            </div>
          </div>
          {/* Sidebar (Related Articles/Ads) */}
          <aside className="md:w-1/3 border-l pl-6 hidden md:block">
            {/* Replace TrendingArticle with your related articles component/data */}
            <TrendingArticle data={relatedArticles} />
            {/* You can add ad blocks or other sidebar content here */}
          </aside>
        </div>
      </div>
    );
}
