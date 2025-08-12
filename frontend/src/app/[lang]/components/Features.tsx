import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface FeaturesProps {
  data: {
    heading: string;
    description: string;
    feature: Feature[];
  };
}

interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// Handle different Strapi response structures
interface StrapiMediaResponse {
  id?: number;
  url?: string;
  name?: string;
  alternativeText?: string;
  data?: {
    attributes: StrapiImage;
  };
  attributes?: StrapiImage;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink: boolean;
  newTab: boolean;
  url: string;
  text: string;
  media?: StrapiMediaResponse;
}

function Feature({ title, description, showLink, newTab, url, text, media }: Feature) {
  // Handle Strapi v5 media structure - media could be an object directly or have nested structure
  let imageUrl = null;
  let altText = title;
  
  if (media) {
    // If media.url exists directly (Strapi v5 format)
    if (media.url) {
      imageUrl = getStrapiMedia(media.url);
      altText = media.alternativeText || media.name || title;
    }
    // If media has a data property (some Strapi structures)
    else if (media.data && media.data.attributes) {
      imageUrl = getStrapiMedia(media.data.attributes.url);
      altText = media.data.attributes.alternativeText || media.data.attributes.name || title;
    }
    // If media has attributes directly
    else if (media.attributes) {
      imageUrl = getStrapiMedia(media.attributes.url);
      altText = media.attributes.alternativeText || media.attributes.name || title;
    }
  }

  return (
    <Card className="healthier-card-feature h-full flex flex-col group">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText}
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1">
        <p className="text-gray-600 leading-relaxed text-center">{description}</p>
      </CardContent>
      
      {showLink && url && text && (
        <CardFooter className="pt-6 justify-center">
          <Link
            href={url}
            target={newTab ? "_blank" : "_self"}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {text}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Features({ data }: FeaturesProps) {
  return (
    <section className="healthier-section healthier-section-alt">
      <div className="content-container">
        <div className="healthier-section-header">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="healthier-section-title">{data.heading}</h2>
              <div className="healthier-section-divider-line"></div>
            </div>
          </div>
          <p className="healthier-section-subtitle">{data.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {data.feature.map((feature: Feature) => (
            <Feature key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
