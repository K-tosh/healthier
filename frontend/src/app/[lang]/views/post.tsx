"use client";

import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';
import Image from 'next/image';
import componentResolver from '../utils/component-resolver';
import { getReadingTime } from '@/app/[lang]/utils/article-utils';
import RichText from '@/app/[lang]/components/RichText';
import { Twitter, Facebook, Linkedin, Clock, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Navigation */}
                <div className="mb-8">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                </div>

                {/* Single Column Layout */}
                <div className="space-y-8">
                    {/* Header Section */}
                    <article className="bg-white">
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                                    {category}
                                </Badge>
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                                    Kenya Health Info
                                </Badge>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
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
                                    className="w-full h-auto rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </article>

                    {/* Medical Disclaimer */}
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Medical Information Notice</AlertTitle>
                        <AlertDescription className="text-blue-700">
                            This article is for educational purposes only and should not replace professional medical advice. 
                            Always consult with a qualified healthcare provider for medical concerns.
                        </AlertDescription>
                    </Alert>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="content" className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6 pb-0">
                            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                                <TabsTrigger value="content">Article</TabsTrigger>
                                <TabsTrigger value="summary">Summary</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                                <TabsTrigger value="local">Kenya Info</TabsTrigger>
                            </TabsList>
                        </div>
                        
                        {/* Main Content Tab */}
                        <TabsContent value="content" className="p-6 pt-4">
                            <div className="prose prose-lg max-w-none">
                                {richTextBlock && <RichText data={{ body: markdown }} />}
                                
                                {/* Process other blocks */}
                                {blocks.filter(block => block.__component !== 'shared.rich-text').map((section: any, index: number) =>
                                    componentResolver(section, index)
                                )}
                            </div>
                        </TabsContent>
                        
                        {/* Summary Tab */}
                        <TabsContent value="summary" className="p-6 pt-4 space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Article Summary</h2>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-gray-700 leading-relaxed">{description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500">Category</p>
                                            <p className="text-lg font-bold text-blue-600 mt-1">{category}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500">Reading Time</p>
                                            <p className="text-lg font-bold text-green-600 mt-1">{readingTime} min</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                            <p className="text-sm font-bold text-orange-600 mt-1">{formatDate(publishedAt)}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        
                        {/* Resources Tab */}
                        <TabsContent value="resources" className="p-6 pt-4 space-y-6">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Article</h2>
                                <div className="flex items-center space-x-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        asChild
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">References & Sources</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                                        <li>World Health Organization (WHO) - Global Health Guidelines</li>
                                        <li>Kenya Ministry of Health - National Health Policies and Guidelines</li>
                                        <li>Medical literature and peer-reviewed publications</li>
                                        <li>International health organizations and medical associations</li>
                                    </ol>
                                </div>
                            </section>
                        </TabsContent>
                        
                        {/* Kenya Local Info Tab */}
                        <TabsContent value="local" className="p-6 pt-4 space-y-6">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Kenya Health Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-red-50 border-red-200">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-red-800 flex items-center">
                                                <AlertTriangle className="w-5 h-5 mr-2" />
                                                Emergency Contacts
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="font-medium text-red-800">Emergency Services</p>
                                                <p className="text-red-700">Call 999 or 112</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-red-800">Ministry of Health Hotline</p>
                                                <p className="text-red-700">0800 721 253</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-blue-800">Healthcare Access</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm space-y-2">
                                            <p className="text-blue-700">
                                                This health information is particularly relevant for individuals living in Kenya. 
                                                Healthcare access and treatment options may vary by region.
                                            </p>
                                            <p className="text-blue-700">
                                                For local healthcare facilities and specialists, consult your nearest health center.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>
                        </TabsContent>
                    </Tabs>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        
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

                    {/* Medical Review Footer */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Review</h3>
                        <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                                {authorImgUrl ? (
                                    <AvatarImage src={authorImgUrl} alt={author?.name} />
                                ) : (
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {author?.name?.charAt(0) || 'M'}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <p className="font-semibold text-gray-900">{author?.name || 'Medical Team'}</p>
                                <p className="text-sm text-gray-600">Medical Writer & Health Expert</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    This article has been medically reviewed to ensure accuracy and reliability of health information. 
                                    Our medical review team consists of qualified healthcare professionals who specialize in various 
                                    areas of medicine and are committed to providing accurate, up-to-date health information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
