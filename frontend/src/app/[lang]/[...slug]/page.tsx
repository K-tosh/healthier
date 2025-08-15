import {Metadata} from "next";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import { getHeadingsFromMarkdown, getReadingTime } from "@/app/[lang]/utils/article-utils";
import RichText from "@/app/[lang]/components/RichText";
import Features from "@/app/[lang]/components/Features";
import FeatureRowsGroup from "@/app/[lang]/components/FeatureRowsGroup";
import FeatureColumnsGroup from "@/app/[lang]/components/FeatureColumnsGroup";
import Hero from "@/app/[lang]/components/Hero";
import FeaturedContent from "@/app/[lang]/components/FeaturedContent";
import VideoEmbed from "@/app/[lang]/components/VideoEmbed";
import Logos from "@/app/[lang]/components/Logos";
import MedicalStats from "@/app/[lang]/components/MedicalStats";
import TestimonialsGroup from "@/app/[lang]/components/TestimonialsGroup";
import LeadForm from "@/app/[lang]/components/LeadForm";
import Quote from "@/app/[lang]/components/Quote";
import Contact from "@/app/[lang]/components/Contact";
import { Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";


type Props = {
    params: {
        lang: string,
        slug: string
    }
}

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.slug, params.lang);

    if (!page.data[0]?.attributes?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].attributes.seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}

// Component mapping for different section types
const componentMap: { [key: string]: any } = {
  'shared.rich-text': RichText,
  'shared.quote': Quote,
  'shared.media': VideoEmbed,
  'shared.slider': Logos,
  'layout.hero-section': Hero,
  'layout.features-section': Features,
  'layout.feature-rows-group': FeatureRowsGroup,
  'layout.feature-columns-group': FeatureColumnsGroup,
  'layout.featured-content': FeaturedContent,
  'layout.logos-section': Logos,
  'layout.stats-section': MedicalStats,
  'layout.testimonials-group': TestimonialsGroup,
  'sections.lead-form': LeadForm,
  'sections.newsletter': LeadForm,
  'sections.newsletter-signup': LeadForm,
  'sections.contact': Contact,
  'sections.contact-us': Contact,
  // Add missing Strapi component mappings
  'sections.hero': Hero,
  'sections.feature-rows-group': FeatureRowsGroup,
  'sections.feature-columns-group': FeatureColumnsGroup,
  'sections.features': Features,
  'sections.logos': Logos,
  'sections.stats': MedicalStats,
  'sections.testimonials': TestimonialsGroup,
  'sections.rich-text': RichText,
  'sections.quote': Quote,
  'sections.media': VideoEmbed,
};

export default async function PageRoute({params}: Props) {
    const page = await getPageBySlug(params.slug, params.lang);
    
    if (page.data.length === 0) {
        return (
            <div className="healthier-section">
                <div className="content-container text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                    <p className="text-gray-600">The requested page could not be found.</p>
                </div>
            </div>
        );
    }

    const pageData = page.data[0].attributes;
    const contentSections = pageData.contentSections || [];

    // Filter out unknown components
    const validSections = contentSections.filter((section: any) => {
        const componentType = section.__component;
        return !!componentMap[componentType];
    });

    // Check if this is an article-style page (has body content)
    const articleSection = validSections.find(
        (section: any) => section.__component === 'shared.rich-text' && section.body
    );

    const isArticlePage = !!articleSection;
    const pageTitle = pageData.title || pageData.heading || "Page";

    if (isArticlePage) {
        // Render as article page (existing functionality)
        const authorInfo = {
            name: articleSection?.author || "HealthierKE Team",
            bio: articleSection?.authorBio || "Health information specialists.",
            date: articleSection?.publishedAt || new Date().toLocaleDateString()
        };
        
        const markdown = articleSection?.body || "";
        const headings = getHeadingsFromMarkdown(markdown);
        const readingTime = getReadingTime(markdown);

        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Article Title and Meta */}
                <h1 className="text-3xl font-bold tracking-tight font-sans mb-2">
                    {articleSection?.title || pageTitle}
                </h1>
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
                                    <a href={`#${h.id}`} className="text-blue-700 hover:underline">
                                        {h.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                
                {/* Article Body */}
                <RichText data={{ body: markdown }} dropCap />
                
                {/* Author & Sharing */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t pt-6 mt-8 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold">{authorInfo.name}</span>
                        <span className="text-gray-400">{authorInfo.bio}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer">
                                <Twitter />
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer">
                                <Facebook />
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer">
                                <Linkedin />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Render as modular page (About Us, etc.)
    return (
        <div className="min-h-screen">
            {/* Page Header */}
            {pageTitle && (
                <section className="healthier-section healthier-section-hero">
                    <div className="content-container">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {pageTitle}
                            </h1>
                            {pageData.description && (
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    {pageData.description}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Dynamic Content Sections */}
            {validSections
                .map((section: any, index: number) => {
                    const componentType = section.__component;
                    const Component = componentMap[componentType];
                    
                    console.log(`📦 Rendering Section ${index + 1}:`, {
                        component: componentType,
                        data: section
                    });

                    return (
                        <Component
                            key={`${componentType}-${index}`}
                            data={section}
                        />
                    );
                })}

            {/* Show message if all sections were filtered out */}
            {contentSections.length > 0 && validSections.length === 0 && (
                <section className="healthier-section">
                    <div className="content-container text-center">
                        <div className="medical-card p-12">
                            <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Content Temporarily Unavailable
                            </h2>
                            <p className="text-gray-600">
                                This page contains content sections that are currently being updated. Please check back later.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Fallback if no content sections */}
            {validSections.length === 0 && contentSections.length === 0 && (
                <section className="healthier-section">
                    <div className="content-container text-center">
                        <div className="medical-card p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Content Coming Soon
                            </h2>
                            <p className="text-gray-600">
                                This page is being configured. Please check back later.
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
