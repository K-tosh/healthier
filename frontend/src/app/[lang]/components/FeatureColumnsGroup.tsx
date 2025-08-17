import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface FeatureColumnsGroupProps {
  data: {
    id?: string;
    heading?: string;
    description?: string;
    features?: Feature[];
    // Alternative property names that might be used
    title?: string;
    subtitle?: string;
    feature?: Feature[];
    columns?: Feature[];
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
  icon?: StrapiMediaResponse;
  // Additional properties that might be present
  link?: string;
  linkText?: string;
}

export default function FeatureColumnsGroup({ data }: FeatureColumnsGroupProps) {
  // Extract features from various possible property names
  const features = data?.features || data?.feature || data?.columns || [];
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
    <section className="healthier-section healthier-section-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-8 md:mt-10 lg:mt-12">
          {features.map((feature: Feature, index: number) => (
            <div
              key={feature.id || `feature-${index}`}
              className="medical-card h-full flex flex-col group p-6"
            >
              <div className="text-center pb-4">
                <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-md transition-all duration-300 overflow-hidden" 
                     style={{ 
                       background: 'linear-gradient(135deg, var(--medical-info-light), var(--medical-accent))',
                       opacity: 0.8
                     }}>
                  {(() => {
                    // Handle Strapi v5 media structure for icons
                    let iconUrl = null;
                    let altText = feature.title;
                    
                    if (feature.icon) {
                      // If icon.url exists directly (Strapi v5 format)
                      if (feature.icon.url) {
                        iconUrl = getStrapiMedia(feature.icon.url);
                        altText = feature.icon.alternativeText || feature.icon.name || feature.title;
                      }
                      // If icon has a data property (some Strapi structures)
                      else if (feature.icon.data && feature.icon.data.attributes) {
                        iconUrl = getStrapiMedia(feature.icon.data.attributes.url);
                        altText = feature.icon.data.attributes.alternativeText || feature.icon.data.attributes.name || feature.title;
                      }
                      // If icon has attributes directly
                      else if (feature.icon.attributes) {
                        iconUrl = getStrapiMedia(feature.icon.attributes.url);
                        altText = feature.icon.attributes.alternativeText || feature.icon.attributes.name || feature.title;
                      }
                    }

                    return iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={altText}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                           style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        {/* Icon placeholder */}
                      </div>
                    );
                  })()}
                </div>
                <h3 className="text-xl font-bold medical-text-primary group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
              
              <div className="pt-0 flex-1">
                <p className="medical-text-secondary leading-relaxed text-center">{feature.description}</p>
              </div>
              
              {((feature.showLink || feature.url || feature.link) && (feature.url || feature.link) && (feature.text || feature.linkText)) && (
                <div className="pt-6 text-center">
                  <Link
                    href={feature.url || feature.link || '#'}
                    target={feature.newTab ? "_blank" : "_self"}
                    className="medical-button-secondary px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md inline-block"
                  >
                    {feature.text || feature.linkText}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {/* Removed SVG icon for clean reading experience */}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
