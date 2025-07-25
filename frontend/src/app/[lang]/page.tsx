export const dynamic = 'force-dynamic';

import LangRedirect from './components/LangRedirect';
import componentResolver from './utils/component-resolver';
import { getPageBySlug } from "@/app/[lang]/utils/get-page-by-slug";

export default async function RootRoute({ params }: { params: { lang: string } }) {
  try {
    const page = await getPageBySlug('home', params.lang);

    if (page.error && page.error.status === 401) {
      console.error('❌ Missing or invalid credentials');
      return <div className="text-red-500">Missing or invalid credentials</div>;
    }

    if (page.data.length === 0 && params.lang !== 'en') {
      return <LangRedirect />;
    }

    if (page.data.length === 0) {
      return <div className="text-gray-500">No content found for homepage</div>;
    }

    const contentSections = page.data[0].attributes.contentSections;

    return (
      <>
        {contentSections.map((section: any, index: number) =>
          componentResolver(section, index)
        )}
      </>
    );
  } catch (error: any) {
    console.error("❌ Error rendering homepage:", error);
    return <div className="text-red-500">Something went wrong loading the homepage.</div>;
  }
}
