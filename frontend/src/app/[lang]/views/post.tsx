"use client";

import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';
import Image from 'next/image';
import componentResolver from '../utils/component-resolver';
import { getReadingTime } from '@/app/[lang]/utils/article-utils';
import RichText from '@/app/[lang]/components/RichText';
import { RelatedArticles } from '@/app/[lang]/components/RelatedArticles';
import { Twitter, Facebook, Linkedin, Clock, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';

interface Article {
    id: number;
    attributes: {
        title: string;
        description: string;
        slug: string;
        cover: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
        authorsBio: {
            data: {
                attributes: {
                    name: string;
                    bio?: string;
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
        category?: {
            data: {
                attributes: {
                    name: string;
                };
            };
        };
        blocks: any[];
        publishedAt: string;
    };
}

export default function Post({ 
    data, 
    relatedArticles = [], 
    locale = 'en' 
}: { 
    data: Article; 
    relatedArticles?: any[]; 
    locale?: string; 
}) {
    const { title, description, publishedAt, cover, authorsBio, blocks } = data.attributes;
    const author = authorsBio.data?.attributes;
    const imageUrl = getStrapiMedia(cover.data?.attributes.url);
    const authorImgUrl = getStrapiMedia(authorsBio.data?.attributes.avatar.data.attributes.url);

    // Find the first shared.rich-text block for markdown content
    const richTextBlock = blocks.find((b: any) => b.__component === 'shared.rich-text');
    const markdown = richTextBlock?.body || '';
    const readingTime = getReadingTime(markdown);

    // Extract category from data if available
    const category = data.attributes.category?.data?.attributes?.name || 'Health Article';

    // Function to handle smooth scrolling to headings
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Extract headings from blocks for table of contents
    const extractHeadings = () => {
        const headings: { title: string; id: string }[] = [];
        
        // Extract from rich text content (markdown headings)
        if (markdown) {
            const headingMatches = markdown.match(/^#{1,6}\s+(.+)$/gm);
            if (headingMatches) {
                headingMatches.forEach((match: string) => {
                    const title = match.replace(/^#{1,6}\s+/, '').trim();
                    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    headings.push({ title, id });
                });
            }
        }

        // Extract from other blocks that have titles
        blocks.forEach((block) => {
            if (block.__component !== 'shared.rich-text' && (block.title || block.heading)) {
                const title = block.title || block.heading;
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                headings.push({ title, id });
            }
        });

        return headings;
    };

    const headings = extractHeadings();

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Section */}
            <section className="healthier-section-compact healthier-section-white border-b">
                <div className="healthier-container">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center font-medium transition-colors duration-200 healthierke-accent-text hover:healthierke-primary-text"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                </div>
            </section>

            {/* Article Content Group - Connected sections with reduced spacing */}
            <div className="article-content-group">
                {/* Article Header Section */}
                <section className="healthier-section-compact healthier-section-white">
                    <div className="healthier-container">
                        <article className="max-w-4xl mx-auto">
                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge className="medical-badge medical-badge-primary">
                                        {category}
                                    </Badge>
                                </div>
                                
                                <h1 className="healthier-section-heading text-3xl md:text-4xl leading-tight">
                                    {title}
                                </h1>
                                
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {description}
                                </p>
                                
                                {/* Meta Information */}
                                <div className="flex items-center space-x-4 text-sm text-gray-500 border-b border-gray-200 pb-4">
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {formatDate(publishedAt)}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {readingTime} min read
                                    </span>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {imageUrl && (
                                <div className="my-6">
                                    <Image 
                                        src={imageUrl} 
                                        alt={title} 
                                        width={800}
                                        height={400}
                                        className="w-full h-auto rounded-lg object-cover shadow-sm"
                                    />
                                </div>
                            )}
                        </article>
                    </div>
                </section>

                {/* Table of Contents */}
                {headings.length > 0 && (
                    <section className="healthier-section-compact healthier-section-light">
                        <div className="healthier-container">
                            <div className="max-w-4xl mx-auto">
                                <div className="medical-card p-4 md:p-6 border-l-4 border-blue-600">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight mb-3 md:mb-4">
                                        Table of Contents
                                    </h2>
                                    <nav className="flex flex-wrap items-center gap-1 text-sm md:text-base leading-relaxed">
                                        {headings.map((heading, index) => (
                                            <span key={heading.id} className="contents">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        scrollToHeading(heading.id);
                                                    }}
                                                    className="text-blue-700 hover:text-blue-900 transition-colors font-bold tracking-tight hover:underline cursor-pointer bg-transparent border-none p-0"
                                                >
                                                    {heading.title}
                                                </button>
                                                {index < headings.length - 1 && (
                                                    <span className="text-gray-400 mx-2 font-bold text-lg">|</span>
                                                )}
                                            </span>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Article Content */}
                <section className="healthier-section-compact healthier-section-white">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="prose prose-lg max-w-none">
                                {richTextBlock && <RichText data={{ body: markdown }} />}
                                
                                {/* Process other blocks */}
                                {blocks.filter(block => block.__component !== 'shared.rich-text').map((section: any, index: number) =>
                                    componentResolver(section, index)
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Share Article Section */}
                <section className="healthier-section-compact healthier-section-light">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="medical-card p-4 md:p-6">
                                <h2 className="healthier-section-heading text-lg md:text-xl mb-3 md:mb-4">Share This Article</h2>
                                <div className="flex items-center flex-wrap gap-2 md:gap-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        asChild
                                        className="medical-button-secondary hover:bg-medical-info-light"
                                        style={{ borderColor: 'var(--medical-accent)', color: 'var(--medical-primary)' }}
                                    >
                                        <a 
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2"
                                        >
                                            <Twitter className="w-4 h-4" />
                                            <span>Twitter</span>
                                        </a>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        asChild
                                        className="medical-button-secondary hover:bg-medical-info-light"
                                        style={{ borderColor: 'var(--medical-accent)', color: 'var(--medical-primary)' }}
                                    >
                                        <a 
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2"
                                        >
                                            <Facebook className="w-4 h-4" />
                                            <span>Facebook</span>
                                        </a>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        asChild
                                        className="medical-button-secondary hover:bg-medical-info-light"
                                        style={{ borderColor: 'var(--medical-accent)', color: 'var(--medical-primary)' }}
                                    >
                                        <a 
                                            href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(title)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            <span>LinkedIn</span>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Author Bio Section */}
                {author && (
                    <section className="healthier-section-compact healthier-section-white" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                        <div className="healthier-container">
                            <div className="max-w-4xl mx-auto">
                                <div className="prose prose-lg max-w-none [&_img]:w-16 [&_img]:h-16 [&_img]:rounded-full [&_img]:object-cover [&_img]:inline [&_img]:mr-3 [&_img]:align-middle">
                                    <RichText data={{ 
                                        body: `${authorImgUrl ? `![${author.name}](${authorImgUrl}) ` : ''}**${author.name}** - Author\n\n${author.bio || ''}` 
                                    }} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Related Articles Section */}
            {relatedArticles && relatedArticles.length > 0 && (
                <RelatedArticles
                    heading="Related Articles"
                    sub_heading="Continue reading with these related health topics"
                    articles={relatedArticles}
                    locale={locale}
                />
            )}
        </div>
    );
}
