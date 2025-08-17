import OptimizedImage from "./OptimizedImage";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";

interface Logo {
  id: number;
  attributes?: {
    url: string;
    alternativeText?: string;
    name?: string;
  };
  // Handle Strapi v5 format
  url?: string;
  alternativeText?: string;
  name?: string;
}

interface LogosProps {
  data: {
    heading?: string;
    title?: string;
    description?: string;
    logos?: {
      data: Logo[];
    };
    images?: {
      data: Logo[];
    };
    files?: {
      data: Logo[];
    };
  };
}

export default function Logos({ data }: LogosProps) {
  console.log("🏥 Logos Component Data:", data);
  
  const heading = data?.heading || data?.title || "Trusted Hospitals";
  const description = data?.description;
  
  // Get logos from various possible property names
  const logosData = data?.logos?.data || data?.images?.data || data?.files?.data || [];
  
  console.log("🎯 Logos Array:", logosData);

  if (!logosData || logosData.length === 0) {
    console.warn("⚠️ Logos: No logos to display");
    return (
      <section className="healthier-section healthier-section-light">
        <div className="content-container">
          <div className="healthier-section-header">
            <h2 className="healthier-section-title">{heading}</h2>
            <div className="healthier-section-divider-line"></div>
            {description && (
              <p className="healthier-section-subtitle">{description}</p>
            )}
          </div>
          <div className="text-center py-8">
            <p className="medical-text-muted">No logos to display</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="healthier-section healthier-section-light">
      <div className="content-container">
        {/* Header */}
        <div className="healthier-section-header">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="healthier-section-title">
                {heading}
              </h2>
              <div className="healthier-section-divider-line mx-auto"></div>
            </div>
          </div>
          {description && (
            <p className="healthier-section-subtitle text-center">
              {description}
            </p>
          )}
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center justify-items-center">
          {logosData.map((logo: Logo, index: number) => {
            // Handle different Strapi response structures
            let imageUrl = null;
            let altText = `Partner logo ${index + 1}`;
            
            if (logo.attributes) {
              // Strapi v4 format
              imageUrl = getStrapiMedia(logo.attributes.url);
              altText = logo.attributes.alternativeText || logo.attributes.name || altText;
            } else if (logo.url) {
              // Strapi v5 format
              imageUrl = getStrapiMedia(logo.url);
              altText = logo.alternativeText || logo.name || altText;
            }

            if (!imageUrl) {
              console.warn(`⚠️ No image URL found for logo ${index + 1}:`, logo);
              return null;
            }

            return (
              <div
                key={logo.id || index}
                className="group relative p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="relative h-16 w-full">
                  <OptimizedImage
                    src={imageUrl}
                    alt={altText}
                    fill={true}
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    quality={75}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
