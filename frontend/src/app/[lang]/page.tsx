'use client';

import { fetchAPI } from './utils/fetch-api';
import { getStrapiMedia } from './utils/api-helpers';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from "./components/ui/button";

// Types for Strapi homepage data
interface HomepageData {
  data: {
    id: number;
    attributes: {
      seo: string;
      seo_descreption: string;
      heroTitle: string;
      heroSubtitle: string;
      wellnessTitle: string;
      featuredConditionsTitle: string;
      promoText: any[];
      promoLInk: string;
      articles: {
        data: Array<{
          id: number;
          attributes: {
            title: string;
            description: string;
            slug: string;
            excerpt?: string;
            cover?: {
              data: {
                attributes: {
                  url: string;
                };
              } | null;
            };
            isTopStory: boolean | null;
            topStoryOrder: number | null;
          };
        }>;
      };
      authors: {
        data: Array<{
          id: number;
          attributes: {
            name: string;
            email: string;
          };
        }>;
      };
      heroImage: {
        data: Array<{
          id: number;
          attributes: {
            url: string;
          };
        }>;
      };
      wellness_articles: {
        data: Array<any>;
      };
      conditions: {
        data: Array<{
          id: number;
          attributes: {
            name: string;
            slug: string;
            overview: any[];
            causes: any[];
            symptoms: any[];
            diagnosis: any[];
            treatment: any[];
            prevention: string;
            references: any[];
          };
        }>;
      };
      promoImage: {
        data: Array<{
          id: number;
          attributes: {
            url: string;
          };
        }>;
      };
      heroDoctorAvatars: {
        data: Array<{
          id: number;
          attributes: {
            url: string;
            alternativeText?: string;
          };
        }>;
      };
      heroHospitalLogos: {
        data: Array<{
          id: number;
          attributes: {
            url: string;
            alternativeText?: string;
          };
        }>;
      };
      heroButton1Text: string;
      heroButton1Link: string;
      heroButton2Text: string;
      heroButton2Link: string;
    };
  };
}

async function getHomepageData() {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/homepage`;
    const urlParamsObject = {
      populate: {
        articles: {
          populate: {
            cover: { fields: ['url'] },
            category: { fields: ['name', 'slug'] },
          },
        },
        authors: {
          populate: '*',
        },
        heroImage: {
          populate: '*',
        },
        conditions: {
          populate: '*',
        },
        promoImage: {
          populate: '*',
        },
        heroDoctorAvatars: {
          populate: '*',
        },
        heroHospitalLogos: {
          populate: '*',
        },
      },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}

// Helper function to safely get media URL
function getImageUrl(item: any): string {
  if (!item?.data?.attributes?.url) {
    return "/placeholder-image.jpg";
  }
  const url = getStrapiMedia(item.data.attributes.url);
  return url || "/placeholder-image.jpg";
}

// Helper function to render rich text content
function renderRichText(content: any[]): string {
  if (!content || !Array.isArray(content)) return '';
  
  return content.map(item => {
    if (item.type === 'text') {
      return item.text || '';
    }
    if (item.type === 'heading' && item.children) {
      return item.children.map((child: any) => child.text || '').join('');
    }
    if (item.type === 'list' && item.children) {
      return item.children.map((child: any) => 
        child.children?.map((grandChild: any) => grandChild.text || '').join('') || ''
      ).join(', ');
    }
    return '';
  }).join(' ');
}

export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHomepageData();
        setHomepageData(data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage...</p>
        </div>
      </div>
    );
  }

  if (!homepageData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Homepage</h1>
          <p className="text-gray-600">Unable to load homepage content. Please try again later.</p>
        </div>
      </div>
    );
  }

  const attributes = homepageData.data.attributes;
  
  // Safely extract data with fallbacks
  const heroTitle = attributes.heroTitle || '';
  const heroSubtitle = attributes.heroSubtitle || '';
  const wellnessTitle = attributes.wellnessTitle || '';
  const featuredConditionsTitle = attributes.featuredConditionsTitle || '';
  const promoText = attributes.promoText || [];
  const promoLInk = attributes.promoLInk || '#';
  const articles = attributes.articles?.data || [];
  const authors = attributes.authors?.data || [];
  const heroImage = attributes.heroImage?.data || [];
  const wellness_articles = attributes.wellness_articles?.data || [];
  const conditions = attributes.conditions?.data || [];
  const promoImage = attributes.promoImage?.data || [];
  const heroDoctorAvatars = attributes.heroDoctorAvatars?.data || [];
  const heroHospitalLogos = attributes.heroHospitalLogos?.data || [];
  const heroButton1Text = attributes.heroButton1Text || 'Check your symptom';
  const heroButton1Link = attributes.heroButton1Link || '/symptoms';
  const heroButton2Text = attributes.heroButton2Text || 'Pata Doc';
  const heroButton2Link = attributes.heroButton2Link || '/pata-doc';
  
  // Filter top stories and sort by topStoryOrder
  const topStories = articles
    .filter((article: any) => article.attributes.isTopStory)
    .sort((a: any, b: any) => {
      const orderA = a.attributes.topStoryOrder || 999;
      const orderB = b.attributes.topStoryOrder || 999;
      return orderA - orderB;
    })
    .slice(0, 4); // Limit to 4 stories

  return (
    <main className="bg-white min-h-screen">
      {/* HERO SECTION - Professional, blurred background */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getStrapiMedia(heroImage?.[0]?.attributes?.url) || '/medical-hero.jpg'}
            alt="Hero background"
            fill
            className="object-cover w-full h-full"
            priority
          />
          {/* Overlay with blur and dark tint */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24 w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            {heroTitle || 'The best community for Healthier Living'}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl drop-shadow">
            {heroSubtitle ||
              "We're building a community to help each other live healthier, happier lives. Join us to access trusted health information, tools, and support."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href={heroButton1Link}>
              <Button size="lg" className="font-bold px-8 py-3">
                {heroButton1Text}
              </Button>
            </Link>
            <Link href={heroButton2Link}>
              <Button variant="secondary" size="lg" className="font-bold px-8 py-3">
                {heroButton2Text}
              </Button>
            </Link>
          </div>
          {/* Avatars (Doctors) */}
          {heroDoctorAvatars.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              {heroDoctorAvatars.map((avatar: any) => (
                <Image
                  key={avatar.id}
                  src={getStrapiMedia(avatar.attributes.url) || '/avatar-placeholder.png'}
                  alt={avatar.attributes.alternativeText || 'Doctor'}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white shadow-md object-cover"
                />
              ))}
            </div>
          )}
          {/* Trusted Hospitals */}
          {heroHospitalLogos.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-2 flex-wrap">
              {heroHospitalLogos.map((logo: any) => (
                <Image
                  key={logo.id}
                  src={getStrapiMedia(logo.attributes.url) || '/hospital-logo-placeholder.png'}
                  alt={logo.attributes.alternativeText || 'Trusted Hospital'}
                  width={64}
                  height={32}
                  className="object-contain grayscale hover:grayscale-0 transition"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NAVIGATION SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Diseases & Conditions', href: '/conditions', icon: '🦠' },
            { title: 'Drugs & Medications', href: '/drugs', icon: '💊' },
            { title: 'Symptoms & Diagnosis', href: '/symptoms', icon: '🩺' },
            { title: 'Wellness & Lifestyle', href: '/wellness', icon: '🏃‍♂️' },
            { title: 'Tools & Calculators', href: '/tools', icon: '🧮' },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition">
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="font-semibold text-blue-900 text-center">{item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP STORIES */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-blue-900 font-extrabold uppercase text-2xl tracking-wide">Today's Top Stories</h2>
          <Link href="/articles" className="text-blue-700 font-semibold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topStories.map((story) => (
            <Link key={story.id} href={`/en/articles/${story.attributes.slug}`} className="group bg-white rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={getStrapiMedia(story.attributes.cover?.data?.attributes?.url) ?? '/placeholder-image.jpg'}
                  alt={story.attributes.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                  {story.attributes.title}
                </h3>
                <p className="text-gray-700 text-sm flex-1">
                  {story.attributes.excerpt || story.attributes.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOOLS & CALCULATORS - commented out until Strapi model is ready */}
      {/*
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-blue-900 font-extrabold uppercase text-2xl tracking-wide mb-6">Tools & Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(attributes.tools || []).map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.slug}`} className="group bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">{tool.icon || '🧮'}</span>
              <h3 className="font-bold text-lg text-blue-900 mb-2">{tool.title}</h3>
              <p className="text-gray-700 text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
      */}

      {/* Featured Conditions Section */}
      {conditions.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-blue-900 font-extrabold uppercase text-2xl tracking-wide mb-6">{featuredConditionsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {conditions.map((condition: any) => (
                <Link
                  key={condition.id}
                  href={`/conditions/${condition.attributes.slug}`}
                  className="group bg-white rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={getImageUrl(condition.attributes.cover)}
                      alt={condition.attributes.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                      {condition.attributes.name}
                    </h3>
                    <p className="text-gray-700 text-sm flex-1">
                      {renderRichText(condition.attributes.overview)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Section */}
      {promoText.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{renderRichText(promoText)}</h3>
                  <Link 
                    href={promoLInk}
                    className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
                {promoImage.length > 0 && (
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={getImageUrl(promoImage[0])}
                      alt="Promo"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Authors Section */}
      {authors.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-blue-900 font-extrabold uppercase text-lg tracking-wide mb-6">Our Contributors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {authors.map((author: any) => (
                <div key={author.id} className="bg-white rounded-xl shadow p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xl">
                      {author.attributes.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{author.attributes.name}</h3>
                  <p className="text-gray-600 text-sm">{author.attributes.email}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
} 