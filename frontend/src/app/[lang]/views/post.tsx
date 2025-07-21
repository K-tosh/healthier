import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';
import Image from 'next/image';
import componentResolver from '../utils/component-resolver';
import { getHeadingsFromMarkdown, getReadingTime } from '@/app/[lang]/utils/article-utils';
import RichText from '@/app/[lang]/components/RichText';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    const headings = getHeadingsFromMarkdown(markdown);
    const readingTime = getReadingTime(markdown);

    return (
        <article className="space-y-8 dark:bg-black dark:text-gray-50 max-w-3xl mx-auto px-4 py-8">
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt="article cover image"
                    width={400}
                    height={400}
                    className="w-full h-96 object-cover rounded-lg"
                />
            )}
            <div className="space-y-6">
                <h1 className="leading-tight text-5xl font-bold ">{title}</h1>
                <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center dark:text-gray-400">
                    <div className="flex items-center md:space-x-2">
                        {authorImgUrl && (
                            <Image
                                src={authorImgUrl}
                                alt="author avatar"
                                width={400}
                                height={400}
                                className="w-14 h-14 border rounded-full dark:bg-gray-500 dark:border-gray-700"
                            />
                        )}
                        <p className="text-md dark:text-violet-400">
                            {author && author.name} • {formatDate(publishedAt)} • {readingTime} min read
                        </p>
                    </div>
                </div>
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
            {richTextBlock && <RichText data={{ body: markdown }} dropCap />}
            {/* Author & Sharing */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-t pt-6 mt-8 gap-4">
                <div className="flex items-center gap-3">
                    {authorImgUrl && (
                        <Image
                            src={authorImgUrl}
                            alt="author avatar"
                            width={40}
                            height={40}
                            className="w-10 h-10 border rounded-full dark:bg-gray-500 dark:border-gray-700"
                        />
                    )}
                    <span className="font-semibold">{author?.name}</span>
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
        </article>
    );
}
