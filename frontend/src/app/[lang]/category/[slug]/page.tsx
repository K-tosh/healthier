import { fetchAPI } from "@/utils/fetch-api";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const res = await fetchAPI(
    "/categories",
    {
      filters: { slug: { $eq: params.slug } },
      populate: {
        articles: {
          populate: ["cover", "category", "authorsBio"],
          sort: ["createdAt:desc"],
        },
      },
    },
    token
  );

  const category = res?.data?.[0];

  if (!category) return notFound();

  const { name, description, articles } = category.attributes;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}

      <div className="grid gap-4">
        {articles.data.length > 0 ? (
          articles.data.map((article: any) => (
            <div
              key={article.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">
                {article.attributes.title}
              </h2>
              <p className="text-gray-600">
                {article.attributes.excerpt || "No summary available."}
              </p>
            </div>
          ))
        ) : (
          <p>No articles yet under this category.</p>
        )}
      </div>
    </div>
  );
}
