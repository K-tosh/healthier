"use client";

import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';
import Image from 'next/image';
import componentResolver from '../utils/component-resolver';
import { getReadingTime } from '@/app/[lang]/utils/article-utils';
import RichText from '@/app/[lang]/components/RichText';
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

export default function Post({ data }: { data: Article }) {
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

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Section */}
            <section className="healthier-section healthier-section-white border-b">
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

            {/* Article Content */}
            <div className="space-y-0">
                {/* Article Header Section */}
                <section className="healthier-section healthier-section-white">
                    <div className="healthier-container">
                        <article className="max-w-4xl mx-auto">
                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge className="medical-badge medical-badge-primary">
                                        {category}
                                    </Badge>
                                    <Badge className="medical-badge medical-badge-success">
                                        Kenya Health Info
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
                                <div className="my-8">
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

                {/* Medical Disclaimer Section */}
                <section className="healthier-section healthier-section-light">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <Alert style={{ 
                                backgroundColor: 'var(--medical-info-light)', 
                                borderColor: 'var(--healthierke-vista-blue)',
                                color: 'var(--medical-text-primary)'
                            }}>
                                <AlertTriangle className="h-4 w-4" style={{ color: 'var(--healthierke-vista-blue)' }} />
                                <AlertTitle style={{ color: 'var(--medical-text-primary)' }}>Medical Information Notice</AlertTitle>
                                <AlertDescription style={{ color: 'var(--medical-text-secondary)' }}>
                                    This article is for educational purposes only and should not replace professional medical advice. 
                                    Always consult with a qualified healthcare provider for medical concerns.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </section>

                {/* Main Article Content */}
                <section className="healthier-section healthier-section-white">
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
                <section className="healthier-section healthier-section-light">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="medical-card p-6">
                                <h2 className="healthier-section-heading text-xl">Share This Article</h2>
                                <div className="flex items-center flex-wrap gap-3">
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

                {/* Kenya Health Information */}
                <section className="healthier-section healthier-section-white">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="medical-card p-6">
                                <h2 className="healthier-section-heading text-xl">Kenya Health Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div style={{ 
                                        backgroundColor: 'var(--medical-error-light)', 
                                        borderColor: '#dc2626',
                                        border: '1px solid'
                                    }} className="rounded-lg p-4">
                                        <h3 className="font-semibold flex items-center mb-3" style={{ color: '#dc2626' }}>
                                            <AlertTriangle className="w-5 h-5 mr-2" />
                                            Emergency Contacts
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="font-medium" style={{ color: '#dc2626' }}>Emergency Services</p>
                                                <p style={{ color: '#b91c1c' }}>Call 999 or 112</p>
                                            </div>
                                            <div>
                                                <p className="font-medium" style={{ color: '#dc2626' }}>Ministry of Health Hotline</p>
                                                <p style={{ color: '#b91c1c' }}>0800 721 253</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ 
                                        backgroundColor: 'var(--medical-info-light)', 
                                        borderColor: 'var(--medical-accent)',
                                        border: '1px solid'
                                    }} className="rounded-lg p-4">
                                        <h3 className="font-semibold mb-3" style={{ color: 'var(--medical-primary)' }}>Healthcare Access</h3>
                                        <div className="text-sm space-y-2">
                                            <p style={{ color: 'var(--medical-text-secondary)' }}>
                                                This health information is particularly relevant for individuals living in Kenya. 
                                                Healthcare access and treatment options may vary by region.
                                            </p>
                                            <p style={{ color: 'var(--medical-text-secondary)' }}>
                                                For local healthcare facilities and specialists, consult your nearest health center.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="healthier-section healthier-section-light">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <h2 className="healthier-section-heading text-xl">Frequently Asked Questions</h2>
                                
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="faq-1">
                                        <AccordionTrigger className="text-left font-medium">
                                            Is this information specific to Kenya?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-700">
                                            Yes, this health information has been tailored to be relevant for individuals living in Kenya, 
                                            taking into account local healthcare systems, prevalent conditions, and available treatments.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="faq-2">
                                        <AccordionTrigger className="text-left font-medium">
                                            Should I consult a doctor before following this advice?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-700">
                                            Absolutely. This article is for educational purposes only. Always consult with a qualified 
                                            healthcare provider before making any medical decisions or if you have specific health concerns.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="faq-3">
                                        <AccordionTrigger className="text-left font-medium">
                                            How often is this information updated?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-700">
                                            Our medical content is regularly reviewed and updated to ensure accuracy. 
                                            The last update date is shown in the article header.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Medical Review Footer */}
                <section className="healthier-section healthier-section-white border-t">
                    <div className="healthier-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="medical-card p-6">
                                <h3 className="healthier-section-heading text-lg">Medical Review</h3>
                                <div className="flex items-start space-x-4">
                                    <Avatar className="h-12 w-12">
                                        {authorImgUrl ? (
                                            <AvatarImage src={authorImgUrl} alt={author?.name} />
                                        ) : (
                                            <AvatarFallback style={{ backgroundColor: 'var(--medical-primary)', color: 'white' }}>
                                                {author?.name?.charAt(0) || 'M'}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold" style={{ color: 'var(--medical-text-primary)' }}>{author?.name || 'Medical Team'}</p>
                                        <p className="text-sm" style={{ color: 'var(--medical-text-secondary)' }}>Medical Writer & Health Expert</p>
                                        <p className="text-sm mt-2" style={{ color: 'var(--medical-text-muted)' }}>
                                            This article has been medically reviewed to ensure accuracy and reliability of health information. 
                                            Our medical review team consists of qualified healthcare professionals who specialize in various 
                                            areas of medicine and are committed to providing accurate, up-to-date health information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
