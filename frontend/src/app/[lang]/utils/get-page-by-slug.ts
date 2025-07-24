import {fetchAPI} from "@/app/[lang]/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const path = `/pages`;

  const urlParamsObject = {
    filters: { slug: { $eq: slug } },
    locale: lang,
    populate: "deep", // Use deep population to get all nested relationships
  };

  return await fetchAPI(path, urlParamsObject, token);
}