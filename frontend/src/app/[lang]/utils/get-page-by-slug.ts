import {fetchAPI} from "@/app/[lang]/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const path = `/pages`;

    const urlParamsObject = {
        filters: { slug: { $eq: slug } },
        locale: lang,
        populate: "*", // Use star population to get all nested relationships
    };

    console.log("🔍 Fetching page data for slug:", slug, "language:", lang);
    console.log("📋 Query parameters:", JSON.stringify(urlParamsObject, null, 2));

    try {
        const result = await fetchAPI(path, urlParamsObject, token);
        console.log("📄 Page data received:", result?.data?.length || 0, "pages found");
        
        if (result?.data?.length > 0) {
            console.log("✅ Page found:", result.data[0].attributes.title || result.data[0].attributes.heading || "Untitled");
            console.log("📋 Content sections:", result.data[0].attributes.contentSections?.length || 0, "sections");
        } else {
            console.warn("⚠️ No page found for slug:", slug);
        }
        
        return result;
    } catch (error) {
        console.error("💥 Error fetching page by slug:", error);
        throw error;
    }
}