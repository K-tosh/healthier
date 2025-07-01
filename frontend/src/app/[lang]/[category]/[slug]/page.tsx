import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Post from '@/app/[lang]/components/Post';
import type { Metadata } from 'next';

async function getPostBySlug(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        populate: {
            cover: { fields: ['url'] },
            authorsBio: { populate: '*' },
            category: { fields: ['name'] },
            blocks: { populate: '*' },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
}

async function getMetaData(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        populate: { seo: { populate: '*' } },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response.data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const meta = await getMetaData(params.slug);
        
        // Check if meta exists and has data
        if (!meta || meta.length === 0 || !meta[0] || !meta[0].attributes || !meta[0].attributes.seo) {
            // Return fallback metadata
            return {
                title: 'Article Not Found',
                description: 'The requested article could not be found.',
            };
        }
        
        const metadata = meta[0].attributes.seo;

        return {
            title: metadata.metaTitle || 'Article',
            description: metadata.metaDescription || 'Article description',
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        // Return fallback metadata on error
        return {
            title: 'Article',
            description: 'Article description',
        };
    }
}

export default async function PostRoute({ params }: { params: { slug: string } }) {
    try {
        const { slug } = params;
        const data = await getPostBySlug(slug);
        
        // Check if data exists and has the expected structure
        if (!data || !data.data || data.data.length === 0) {
            return (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-gray-800">Article Not Found</h2>
                    <p className="text-gray-600 mt-2">The requested article could not be found.</p>
                </div>
            );
        }
        
        return <Post data={data.data[0]} />;
    } catch (error) {
        console.error('Error loading article:', error);
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800">Error Loading Article</h2>
                <p className="text-gray-600 mt-2">There was an error loading the article. Please try again later.</p>
            </div>
        );
    }
}

export async function generateStaticParams() {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const articleResponse = await fetchAPI(
        path,
        {
            populate: ['category'],
        },
        options
    );

    return articleResponse.data.map(
        (article: {
            attributes: {
                slug: string;
                category: {
                    slug: string;
                };
            };
        }) => ({ slug: article.attributes.slug, category: article.attributes.slug })
    );
}
