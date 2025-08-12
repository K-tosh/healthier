import qs from "qs";
import { getStrapiURL } from "./api-helpers";

export async function fetchAPI(path: string, query: any, authToken?: string) {
  const baseURL = getStrapiURL();
  const url = new URL("/api" + path, baseURL);
  url.search = qs.stringify(query);

  const baseHeader = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Strapi-Response-Format": "v4",
    },
    // Disable caching to always get fresh data from Strapi
    cache: "no-store" as RequestCache,
    next: { 
      revalidate: 0,  // Disable Next.js caching
    },
  };

  const headerWithAuth = {
    ...baseHeader,
    headers: {
      ...baseHeader.headers,
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    console.log("🔄 Fetching fresh data from Strapi:", url.toString());
    const response = await fetch(url, authToken ? headerWithAuth : baseHeader);
    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Strapi API Error:", response.status, response.statusText);
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    console.log("✅ Successfully fetched data from Strapi");
    return data;
  } catch (error) {
    console.error("💥 Error fetching data:", error);
    throw error;
  }
}