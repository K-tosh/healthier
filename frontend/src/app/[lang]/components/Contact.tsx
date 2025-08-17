import FormSubmit from "./FormSubmit";

interface ContactProps {
  data: {
    id?: string | number;
    __component?: string;
    // Direct fields from Strapi (flat structure)
    title?: string;
    subtitle?: string;
    phone?: string | number;
    email?: string;
    address?: string;
    officeHours?: string;
    mapEmbededUrl?: string; // Note: matches Strapi typo "Embeded"
    // Legacy nested structure support
    contactInfo?: {
      title?: string;
      subtitle?: string;
      phone?: string | number;
      email?: string;
      address?: string;
      officeHours?: string;
      emergencyPhone?: string;
      mapEmbedUrl?: string;
    };
    formTitle?: string;
    formSubtitle?: string;
    formPlaceholder?: string;
    formButtonText?: string;
  };
}

export default function Contact({ data }: ContactProps) {
  console.log("🚀 CONTACT COMPONENT RENDERED!");
  console.log("📞 Contact Data:", JSON.stringify(data, null, 2));

  // Support both flat structure (current Strapi) and nested structure
  const contactInfo = data.contactInfo || data;
  
  // Use form-specific data first, then fall back to contact data, then defaults
  const title = data.formTitle || contactInfo.title || "Get in Touch";
  const subtitle = data.formSubtitle || contactInfo.subtitle || "We're here to help with your health questions and concerns.";
  const formPlaceholder = data.formPlaceholder || "Enter your email address";
  const formButtonText = data.formButtonText || "Contact Us";
  
  // Handle phone number (could be string or number from Strapi)
  const phone = contactInfo.phone ? String(contactInfo.phone) : null;
  const mapUrl = data.mapEmbededUrl || (data.contactInfo?.mapEmbedUrl); // Handle both spellings
  const emergencyPhone = data.contactInfo?.emergencyPhone; // Only available in nested structure

  return (
    <section className="healthier-section">
      <div className="content-container">
        <div className="text-center mb-8">
          <h2 className="healthier-section-title">{title}</h2>
          <div className="healthier-section-divider-line mx-auto mb-6"></div>
          <p className="healthier-section-subtitle max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="medical-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Contact Information
              </h3>

              <div className="space-y-6">
                {phone && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-700">
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.email && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:text-blue-700">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                )}

                {contactInfo.officeHours && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-gray-600">{contactInfo.officeHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact - only show if legacy nested structure has it */}
            {emergencyPhone && (
              <div className="medical-card p-6 bg-red-50 border border-red-200">
                <h4 className="font-bold text-red-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Emergency Contact
                </h4>
                <p className="text-red-700 text-sm mb-2">For urgent health emergencies, call:</p>
                <a 
                  href={`tel:${emergencyPhone}`}
                  className="text-lg font-bold text-red-800 hover:text-red-900"
                >
                  {emergencyPhone}
                </a>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <div className="medical-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send us a Message
              </h3>
              
              <p className="text-gray-600 mb-6">
                Have a health question or want to stay updated with our latest content? 
                Drop us your email and we'll get back to you.
              </p>
              
              <FormSubmit 
                placeholder={formPlaceholder}
                text={formButtonText}
              />
              
              <p className="text-xs text-gray-500 mt-4">
                By submitting your email, you agree to receive health tips and updates from HealthierKE. 
                You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {mapUrl && (
          <div className="mt-12">
            <div className="medical-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Find Us
              </h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HealthierKE Location"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
