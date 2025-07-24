// utils/get-featured-articles.ts
export async function getFeaturedArticles(limit: number = 3) {
  try {
    const healthCategories = ['diseases-and-conditions', 'symptoms-and-diagnosis', 'drugs-and-medications'];
    const categoryFilters = healthCategories.map(cat => `filters[category][slug][$eq]=${cat}`).join('&');
    
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*&pagination[limit]=${limit}&sort=createdAt:desc&${categoryFilters}`;
    console.log("🔍 Fetching articles from:", url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    console.log("📡 Response status:", response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log("📊 Articles result:", result);
      
      // If no category-specific articles found, fallback to recent articles
      if (result.data && result.data.length === 0) {
        console.log("🔄 No category articles found, trying fallback...");
        const fallbackUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*&pagination[limit]=${limit}&sort=createdAt:desc`;
        console.log("🔍 Fallback URL:", fallbackUrl);
        
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
          next: { revalidate: 300 },
        });
        
        if (fallbackResponse.ok) {
          const fallbackResult = await fallbackResponse.json();
          console.log("📊 Fallback result:", fallbackResult);
          return fallbackResult.data || [];
        }
      }
      
      return result.data || [];
    } else {
      console.error("❌ Response not ok:", response.status, response.statusText);
    }
    
    return [];
  } catch (error) {
    console.error("❌ Error fetching featured articles:", error);
    return [];
  }
}
