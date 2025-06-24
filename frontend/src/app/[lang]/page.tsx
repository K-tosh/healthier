"use client";
import { useState, useEffect } from "react";
import { fetchAPI } from "./utils/fetch-api";
import { getStrapiMedia } from "./utils/api-helpers";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUserCircle, FaChevronDown, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

// Types for Strapi data
interface TopStory {
  id: number;
  attributes: {
    title: string;
    excerpt: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
    slug: string;
  };
}

interface LivingHealthyItem {
  id: number;
  attributes: {
    title: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
    slug: string;
  };
}

interface Contributor {
  id: number;
  attributes: {
    name: string;
    title: string;
    specialty: string;
    avatar: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
    article: {
      title: string;
      slug: string;
    };
  };
}

interface Tool {
  id: number;
  attributes: {
    title: string;
    icon: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
    slug: string;
  };
}

export default function HomePage() {
  // State management for data - initialize with empty arrays
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [livingHealthy, setLivingHealthy] = useState<LivingHealthyItem[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to safely get media URL
  const getImageUrl = (item: any): string => {
    if (!item?.data?.attributes?.url) {
      return "/placeholder-image.jpg"; // Provide a default placeholder image
    }
    const url = getStrapiMedia(item.data.attributes.url);
    return url || "/placeholder-image.jpg";
  };

  // Fetch data from Strapi
  useEffect(() => {
    async function fetchData() {
      try {
        const [topStoriesRes, livingHealthyRes, contributorsRes, toolsRes] = await Promise.all([
          fetchAPI("/articles", { 
            populate: "*",
            sort: "topStoryOrder:asc",
            filters: { isTopStory: { $eq: true } },
            pagination: { limit: 4 }
          }),
          fetchAPI("/living-healthies", { 
            populate: "*",
            limit: 5
          }),
          fetchAPI("/contributors", { 
            populate: "*",
            limit: 4
          }),
          fetchAPI("/tools", { 
            populate: "*"
          })
        ]);

        setTopStories(topStoriesRes.data || []);
        setLivingHealthy(livingHealthyRes.data || []);
        setContributors(contributorsRes.data || []);
        setTools(toolsRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set empty arrays on error
        setTopStories([]);
        setLivingHealthy([]);
        setContributors([]);
        setTools([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Only homepage sections here. Remove Navbar and Footer. */}
      {/* Top Stories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-blue-900 font-extrabold uppercase text-lg tracking-wide mb-2">Today's Top Stories</h2>
        <div className="border-b border-gray-200 mb-6"></div>
        {topStories[0] && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            <Link href={`/article/${topStories[0].attributes.slug}`} aria-label={topStories[0].attributes.title} className="block group">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(topStories[0].attributes.image)}
                  alt={topStories[0].attributes.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
                />
              </div>
            </Link>
            <Link href={`/article/${topStories[0].attributes.slug}`} aria-label={topStories[0].attributes.title} className="block group">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{topStories[0].attributes.title}</h3>
              <p className="text-lg text-gray-700 mb-2">{topStories[0].attributes.excerpt}</p>
            </Link>
          </div>
        )}
        <div className="border-b border-gray-200 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {topStories.slice(1, 4).map((story) => (
            <Link key={story.id} href={`/article/${story.attributes.slug}`} aria-label={story.attributes.title} className="flex bg-white rounded-lg shadow-sm hover:shadow-md transition group overflow-hidden">
              <div className="relative w-28 h-28 flex-shrink-0">
                <Image
                  src={getImageUrl(story.attributes.image)}
                  alt={story.attributes.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
                />
              </div>
              <div className="p-4 flex flex-col justify-center">
                <h3 className="font-extrabold text-md text-gray-900 group-hover:text-blue-700 transition-colors mb-1">{story.attributes.title}</h3>
                <p className="text-gray-700 text-sm">{story.attributes.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Living Healthy */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-blue-900 font-extrabold uppercase text-lg tracking-wide">Living Healthy</h2>
            <Link href="/living-healthy" className="text-blue-700 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {livingHealthy.map((item) => (
              <Link key={item.id} href={`/living-healthy/${item.attributes.slug}`} className="group block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image
                    src={getImageUrl(item.attributes.image)}
                    alt={item.attributes.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-md text-gray-900 group-hover:text-blue-700 transition-colors mb-1">{item.attributes.title}</h3>
                  <p className="text-gray-700 text-sm">{(item.attributes as any).description ? (item.attributes as any).description : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Patient and Expert Contributors */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-blue-900 font-extrabold uppercase text-lg tracking-wide">Patient and Expert Contributors</h2>
          <Link href="/contributors" className="text-blue-700 font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <div className="relative h-32 w-32 mb-4">
                <Image
                  src={getImageUrl(contributor.attributes.avatar)}
                  alt={contributor.attributes.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="text-center">
                <h3 className="font-extrabold text-gray-900">{contributor.attributes.name}</h3>
                <p className="text-blue-700 text-sm font-semibold">{contributor.attributes.title}</p>
                <p className="text-gray-500 text-sm mt-2">{contributor.attributes.specialty}</p>
                <Link 
                  href={`/article/${contributor.attributes.article.slug}`}
                  className="text-blue-700 hover:underline text-sm mt-2 block font-semibold"
                >
                  {contributor.attributes.article.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools, Trackers & Calculators */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-blue-900 font-extrabold uppercase text-lg tracking-wide mb-6">Tools, Trackers & Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {tools.map((tool) => (
              <Link 
                key={tool.id}
                href={`/tools/${tool.attributes.slug}`}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center group"
              >
                <div className="relative h-16 w-16 mb-3">
                  <Image
                    src={getImageUrl(tool.attributes.icon)}
                    alt={tool.attributes.title}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-center text-md font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors">{tool.attributes.title}</p>
                <p className="text-center text-gray-700 text-sm mt-1">{(tool.attributes as any).description ? (tool.attributes as any).description : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}