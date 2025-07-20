// lib/api/get-conditions.ts
export async function getConditions(lang = 'en') {
    const res = await fetch(`${process.env.STRAPI_URL}/api/conditions?locale=${lang}`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 }, // optional caching
    });
  
    const json = await res.json();
    console.log("STRAPI_URL:", process.env.STRAPI_URL);
    return json.data.map((item: any) => ({
      title: item.attributes.title,
      slug: item.attributes.slug,
    }));
  }
  