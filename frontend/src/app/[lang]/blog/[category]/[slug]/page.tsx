import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Post from '@/app/[lang]/views/post';
import type { Metadata } from 'next';

async function getPostBySlug(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        populate: {
        cover: { fields: ["url"] },
        authorsBio: { populate: "*" },
        category: { fields: ["name"] },
            blocks: { 
          on: {
            "shared.media": {
              populate: "*",
            },
            "shared.quote": {
              populate: "*",
            },
            "shared.rich-text": {
              populate: "*",
            },
            "shared.slider": {
              populate: "*",
            },
            "shared.video-embed": {
              populate: "*",
            },
          },
            },
        },
    };
    const response = await fetchAPI(path, urlParamsObject, token);
    return response;
}

async function getMetaData(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
      populate: { seo: { populate: "*" } },
    };
    const response = await fetchAPI(path, urlParamsObject, token);
    return response.data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const meta = await getMetaData(params.slug);
    const metadata = meta[0].attributes.seo;

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription,
    };
}

export default async function PostRoute({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const data = await getPostBySlug(slug);
    if (data.data.length === 0) return <h2>no post found</h2>;
    return <Post data={data.data[0]} />;
}

export async function generateStaticParams() {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const articleResponse = await fetchAPI(
        path,
        {
      populate: ["category"],
        },
    token
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