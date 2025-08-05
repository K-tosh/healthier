import Link from "next/link";

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

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink?: boolean;
  newTab?: boolean;
  url?: string;
  text?: string;
  icon?: string;
  // Additional properties that might be present
  link?: string;
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
      <section className="webmd-section webmd-section-white">
        <div className="webmd-container">
          <div className="text-center py-8">
            <p className="medical-text-muted">No features to display</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="webmd-section webmd-section-light">
      <div className="webmd-container">
        <div className="webmd-section-header">
          {heading && (
            <h2 className="webmd-section-title medical-text-primary">
              {heading}
            </h2>
          )}
          {description && (
            <p className="webmd-section-subtitle medical-text-secondary">
              {description}
            </p>
          )}
          <div className="webmd-section-divider-line"></div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold medical-text-primary">
                    {feature.title}
                  </h3>
                </div>

                <p className="medical-text-secondary text-lg leading-relaxed">
                  {feature.description}
                </p>

                {((feature.showLink || feature.url || feature.link) && (feature.url || feature.link) && (feature.text || feature.linkText)) && (
                  <div className="pt-4">
                    <Link
                      href={feature.url || feature.link || '#'}
                      target={feature.newTab ? "_blank" : "_self"}
                      className="medical-button-primary px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md inline-flex items-center space-x-2"
                    >
                      <span>{feature.text || feature.linkText}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Visual Side */}
              <div className={`mt-8 lg:mt-0 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                {feature.image?.data?.attributes?.url ? (
                  <div className="relative">
                    <img
                      src={feature.image.data.attributes.url}
                      alt={feature.image.data.attributes.alternativeText || feature.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-12 h-12 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
