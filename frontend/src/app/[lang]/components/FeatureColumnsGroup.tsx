import Link from "next/link";

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
}

export default function FeatureColumnsGroup({ data }: FeatureColumnsGroupProps) {
  // Extract features from various possible property names
  const features = data?.features || data?.feature || data?.columns || [];
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
    <section className="webmd-section webmd-section-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature: Feature, index: number) => (
            <div
              key={feature.id || `feature-${index}`}
              className="medical-card h-full flex flex-col group p-6"
            >
              <div className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-md transition-all duration-300" 
                     style={{ 
                       background: 'linear-gradient(135deg, var(--medical-info-light), var(--medical-accent))',
                       opacity: 0.8
                     }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-8 h-8 transition-colors duration-300"
                    style={{ color: 'var(--medical-primary)' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
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
