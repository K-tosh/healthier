import {Metadata} from "next";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";
import { Card, CardContent } from "@/components/ui/card";
import TrendingArticle from "@/app/[lang]/components/TrendingArticle";
import { getHeadingsFromMarkdown, getReadingTime } from "@/app/[lang]/utils/article-utils";
import RichText from "@/app/[lang]/components/RichText";
import { Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


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
    // Find the main article section (assuming first rich text or similar)
    const articleSection = contentSections.find(
      (section: any) => section.body && typeof section.body === 'string'
    );
    const authorInfo = {
      name: articleSection?.author || "Jane Doe",
      bio: articleSection?.authorBio || "Health journalist and editor.",
      date: articleSection?.publishedAt || "April 2024"
    };
    const markdown = articleSection?.body || "";
    const headings = getHeadingsFromMarkdown(markdown);
    const readingTime = getReadingTime(markdown);
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Article Title and Meta */}
        <h1 className="text-3xl font-bold tracking-tight font-sans mb-2">{articleSection?.title || "Untitled Article"}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-4 gap-4">
          <span>{readingTime} min read</span>
          <span>•</span>
          <span>{authorInfo.date}</span>
        </div>
        {/* Table of Contents */}
        {headings.length > 2 && (
          <nav className="my-6 bg-gray-50 rounded p-4 border">
            <h2 className="text-base font-semibold mb-2">On this page</h2>
            <ul className="space-y-1">
              {headings.map(h => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-blue-700 hover:underline">{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {/* Article Body with Drop Cap */}
        {articleSection && <RichText data={{ body: markdown }} dropCap />}
        {/* Author & Sharing */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-t pt-6 mt-8 gap-4">
          <div className="flex items-center gap-3">
            {/* Optional: <img src={authorInfo.avatar} ... /> */}
            <span className="font-semibold">{authorInfo.name}</span>
            <span className="text-gray-400">{authorInfo.bio}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer"><Twitter /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer"><Facebook /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer"><Linkedin /></a>
            </Button>
          </div>
        </div>
      </div>
    );
}
