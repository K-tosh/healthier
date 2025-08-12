import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface FeatureRowsGroupProps {
  data: {
    id?: string;
    heading?: string;
    description?: string;
    features?: Feature[];
    // Alternative property names that might be used
    title?: string;
    subtitle?: string;
    feature?: Feature[];
    rows?: Feature[];
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

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink?: boolean;
  newTab?: boolean;
  url?: string;
  text?: string;
  icon?: string;
  media?: StrapiMediaResponse;
  // Additional properties that might be present
  link?: {
    url?: string;
    newTab?: boolean;
    text?: string;
  };
  linkText?: string;
  image?: {
    data?: {
      attributes?: {
        url?: string;
        alternativeText?: string;
      };
    };
  };
}

export default function FeatureRowsGroup({ data }: FeatureRowsGroupProps) {
  // Extract features from various possible property names
  const features = data?.features || data?.feature || data?.rows || [];
  const heading = data?.heading || data?.title;
  const description = data?.description || data?.subtitle;

  if (!features || features.length === 0) {
    return (
      <section className="healthier-section healthier-section-white">
        <div className="healthier-container">
          <div className="text-center py-8">
            <p className="medical-text-muted">No features to display</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="healthier-section healthier-section-light">
      <div className="healthier-container">
        <div className="healthier-section-header">
          {heading && (
            <h2 className="healthier-section-title medical-text-primary">
              {heading}
            </h2>
          )}
          {description && (
            <p className="healthier-section-subtitle medical-text-secondary">
              {description}
            </p>
          )}
          <div className="healthier-section-divider-line"></div>
        </div>

        <div className="space-y-12 mt-12">
          {features.map((feature: Feature, index: number) => (
            <div
              key={feature.id || `feature-row-${index}`}
              className={`medical-card p-8 ${
                index % 2 === 0 
                  ? 'lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center' 
                  : 'lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center'
              }`}
            >
              {/* Content Side */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--medical-primary), var(--medical-accent))',
                    }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold medical-text-primary">
                    {feature.title}
                  </h3>
                </div>

                <p className="medical-text-secondary text-lg leading-relaxed">
                  {feature.description}
                </p>

                {((feature.showLink || feature.url || feature.link) && (feature.url || feature.link?.url) && (feature.text || feature.link?.text || feature.linkText)) && (
                  <div className="pt-4">
                    <Link
                      href={feature.url || feature.link?.url || '#'}
                      target={(feature.newTab || feature.link?.newTab) ? "_blank" : "_self"}
                      className="medical-button-primary px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md inline-flex items-center space-x-2"
                    >
                      <span>{feature.text || feature.link?.text || feature.linkText}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Visual Side */}
              <div className={`mt-8 lg:mt-0 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                {(() => {
                  // Handle Strapi v5 media structure - media could be an object directly or have nested structure
                  let imageUrl = null;
                  let altText = feature.title;
                  
                  if (feature.media) {
                    // If media.url exists directly (Strapi v5 format)
                    if (feature.media.url) {
                      imageUrl = getStrapiMedia(feature.media.url);
                      altText = feature.media.alternativeText || feature.media.name || feature.title;
                    }
                    // If media has a data property (some Strapi structures)
                    else if (feature.media.data && feature.media.data.attributes) {
                      imageUrl = getStrapiMedia(feature.media.data.attributes.url);
                      altText = feature.media.data.attributes.alternativeText || feature.media.data.attributes.name || feature.title;
                    }
                    // If media has attributes directly
                    else if (feature.media.attributes) {
                      imageUrl = getStrapiMedia(feature.media.attributes.url);
                      altText = feature.media.attributes.alternativeText || feature.media.attributes.name || feature.title;
                    }
                  }
                  // Fallback to legacy image structure
                  else if (feature.image?.data?.attributes?.url) {
                    imageUrl = getStrapiMedia(feature.image.data.attributes.url);
                    altText = feature.image.data.attributes.alternativeText || feature.title;
                  }

                  return imageUrl ? (
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt={altText}
                        width={400}
                        height={300}
                        className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      />
                      <div className="absolute inset-0 rounded-xl" style={{ 
                        background: 'linear-gradient(135deg, rgba(2, 19, 115, 0.1), rgba(132, 145, 217, 0.1))'
                      }}></div>
                    </div>
                  ) : (
                    <div 
                      className="w-full h-64 lg:h-80 rounded-xl flex items-center justify-center"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--medical-info-light), var(--medical-bg-secondary))'
                      }}
                    >
                      <div 
                        className="w-24 h-24 rounded-2xl flex items-center justify-center"
                        style={{ 
                          background: 'linear-gradient(135deg, var(--medical-primary), var(--medical-accent))'
                        }}
                      >
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {/* Image placeholder */}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
