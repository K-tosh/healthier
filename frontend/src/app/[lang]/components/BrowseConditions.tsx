import Link from "next/link";

interface Category {
  id: number | string;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    articles?: {
      data: Array<{}>;
    };
  };
}

const defaultEmojis = [
  "❤️", "🧠", "🦴", "🫁", "💊", "🧘", "👩‍⚕️", "🩺"
];

interface BrowseConditionsProps {
  data?: {
    heading?: string;
    description?: string;
  };
  categories: Category[];
}

export default function BrowseConditions({ data, categories }: BrowseConditionsProps) {
  const heading = data?.heading || "Browse Health Conditions";
  const description = data?.description || "Find reliable information about common health conditions and symptoms.";
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat: Category, i: number) => {
            const articleCount = cat.attributes.articles?.data?.length || 0;
            return (
              <div
                key={cat.id}
                className="medical-card p-6 hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors duration-200">
                    {defaultEmojis[i % defaultEmojis.length]}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {cat.attributes.name}
                  </h3>
                  {cat.attributes.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{cat.attributes.description}</p>
                  )}
                  {articleCount > 0 && (
                    <p className="text-xs text-blue-600 font-medium mb-4">
                      {articleCount} article{articleCount !== 1 ? 's' : ''} available
                    </p>
                  )}
                  <Link
                    href={`/blog/${cat.attributes.slug}`}
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors duration-200"
                  >
                    Learn More 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link
            href="/blog"
            className="px-8 py-3 rounded-lg bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            View All Articles 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 