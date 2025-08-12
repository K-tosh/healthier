import FormSubmit from "./FormSubmit";

interface EmailProps {
  id?: string | number;
  __component?: string;
  title?: string;
  description?: string | null;
  emailPlaceholder?: string;
  location?: string | null;
  submitButton?: {
    id?: number;
    text?: string;
    type?: string;
  };
}

export default function LeadForm({ data }: { data: EmailProps }) {
  console.log("📧 LeadForm Data:", data);
  
  const title = data.title || "Stay Updated";
  const description = data.description || "Subscribe to our newsletter for the latest health insights and updates.";
  const emailPlaceholder = data.emailPlaceholder || "Enter your email address";
  const buttonText = data.submitButton?.text || "Subscribe";

  return (
    <section className="healthier-section healthier-section-alt">
      <div className="content-container">
        <div className="medical-card p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Heading */}
            <h2 className="healthier-section-title text-center mb-6">
              {title}
            </h2>
            <div className="healthier-section-divider-line mx-auto mb-6"></div>
            
            {/* Description */}
            {description && (
              <p className="healthier-section-subtitle text-center mb-8">
                {description}
              </p>
            )}
            
            {/* Form */}
            <div className="max-w-md mx-auto">
              <FormSubmit 
                placeholder={emailPlaceholder} 
                text={buttonText} 
              />
            </div>
            
            {/* Privacy note */}
            <p className="text-sm text-gray-500 mt-6">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
