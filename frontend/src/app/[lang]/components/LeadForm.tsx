import FormSubmit from "./FormSubmit";

interface EmailProps {
  id: string;
  __component: string;
  title: string;
  description: string;
  emailPlaceholder: string;
  submitButton: {
    text: string;
  };
}

export default function LeadForm({ data }: { data: EmailProps }) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="medical-card p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {data.title}
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {data.description}
            </p>
            
            {/* Form */}
            <div className="max-w-md mx-auto">
              <FormSubmit 
                placeholder={data.emailPlaceholder} 
                text={data.submitButton.text} 
              />
            </div>
            
            {/* Privacy note */}
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
