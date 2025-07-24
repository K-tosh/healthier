import ArticleSelect from "@/app/[lang]/components/ArticleSelect";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";

async function fetchSideMenuData(filter: string) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const categoriesResponse = await fetchAPI(
      "/categories",
      { populate: "*" },
      token
    );

    const articlesResponse = await fetchAPI(
      "/articles",
      filter
        ? {
            filters: {
              category: {
                name: filter,
              },
            },
          }
        : {},
      token
    );

    return {
      articles: articlesResponse.data,
      categories: categoriesResponse.data,
    };
  } catch (error) {
    console.error(error);
  }
}

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    articles: {
      data: Array<{}>;
    };
  };
}

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
  };
}

interface Data {
  articles: Article[];
  categories: Category[];
}

export default async function LayoutRoute({
  params,
  children,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
    category: string;
  };
}) {
  const { category } = params;
  const { categories, articles } = (await fetchSideMenuData(category)) as Data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents will be added here via client-side JS if needed */}
              <div id="table-of-contents-sidebar" className="hidden">
                <div className="medical-card p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Table of Contents
                  </h3>
                  <nav id="toc-nav" className="space-y-2">
                    {/* TOC will be populated by JavaScript */}
                  </nav>
                </div>
              </div>
              
              {/* Related Articles */}
              <div className="medical-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Related Articles
                </h3>
                <ArticleSelect
                  categories={categories}
                  articles={articles}
                  params={params}
                />
              </div>
              
              {/* Categories */}
              <div className="medical-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Health Categories
                </h3>
                <div className="space-y-2">
                  {categories.slice(0, 8).map((cat) => (
                    <a
                      key={cat.id}
                      href={`/blog/${cat.attributes.slug}`}
                      className="block text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm py-1"
                    >
                      {cat.attributes.name}
                    </a>
                  ))}
                  {categories.length > 8 && (
                    <a
                      href="/blog"
                      className="block text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm py-1 font-medium"
                    >
                      View All Categories →
                    </a>
                  )}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="medical-card p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Informed</h3>
                  <p className="text-sm text-gray-600 mb-4">Get the latest health tips and medical insights delivered to your inbox.</p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">No spam, unsubscribe anytime.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
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
