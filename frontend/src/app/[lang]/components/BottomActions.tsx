import Link from "next/link";

interface BottomActionsProps {
  data: {
    id?: string;
    heading?: string;
    description?: string;
    buttons?: Button[];
    // Alternative property names that might be used
    title?: string;
    subtitle?: string;
    actions?: Button[];
    cta?: Button[];
  };
}

interface Button {
  id: string;
  text: string;
  type?: string;
  url: string;
  newTab?: boolean;
  // Alternative property names
  label?: string;
  link?: string;
  variant?: string;
}

export default function BottomActions({ data }: BottomActionsProps) {
  // Extract buttons from various possible property names
  const buttons = data?.buttons || data?.actions || data?.cta || [];
  const heading = data?.heading || data?.title;
  const description = data?.description || data?.subtitle;

  if (!buttons || buttons.length === 0) {
    return null; // Don't render anything if no actions
  }

  return (
    <section className="webmd-section webmd-section-primary">
      <div className="webmd-container">
        <div className="text-center space-y-8">
          {/* Header Content */}
          <div className="space-y-4">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {buttons.map((button: Button, index: number) => {
              const buttonText = button.text || button.label;
              const buttonUrl = button.url || button.link;
              const buttonType = button.type || button.variant;
              
              if (!buttonText || !buttonUrl) return null;

              const isSecondary = buttonType === "secondary" || buttonType === "outline";

              return (
                <Link
                  key={button.id || `action-${index}`}
                  href={buttonUrl}
                  target={button.newTab ? "_blank" : "_self"}
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center space-x-2 ${
                    isSecondary
                      ? "bg-white text-medical-primary border-2 border-white hover:bg-gray-50 hover:text-medical-primary-hover"
                      : "bg-medical-accent text-white border-2 border-medical-accent hover:bg-white hover:text-medical-primary hover:border-white"
                  }`}
                >
                  <span>{buttonText}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-blue-400/30">
            <div className="flex items-center space-x-2 text-blue-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Medically Reviewed</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Evidence-Based</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Trusted Source</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-20" 
             style={{ background: 'linear-gradient(135deg, var(--medical-accent), var(--medical-bg-primary))' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
             style={{ background: 'linear-gradient(135deg, var(--medical-bg-primary), var(--medical-accent))' }}></div>
      </div>
    </section>
  );
}
