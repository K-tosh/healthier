"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const defaultStats: StatItem[] = [
  {
    value: "500K+",
    label: "Trusted Readers",
    icon: "👥",
    color: "from-blue-500 to-blue-600"
  },
  {
    value: "98%",
    label: "Accuracy Rate",
    icon: "🎯",
    color: "from-green-500 to-green-600"
  },
  {
    value: "24/7",
    label: "Health Support",
    icon: "🩺",
    color: "from-purple-500 to-purple-600"
  },
  {
    value: "15+",
    label: "Medical Experts",
    icon: "👨‍⚕️",
    color: "from-orange-500 to-orange-600"
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    content: "An excellent resource for patients seeking reliable health information. The content is well-researched and medically accurate.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Health Coach",
    content: "I regularly recommend this platform to my clients. The information is comprehensive yet easy to understand.",
    rating: 5
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Family Medicine",
    content: "The evidence-based approach and clear explanations make this a valuable tool for health education.",
    rating: 5
  }
];

interface MedicalStatsProps {
  stats?: StatItem[];
  testimonials?: Testimonial[];
  showStats?: boolean;
  showTestimonials?: boolean;
}

export default function MedicalStats({ 
  stats = defaultStats, 
  testimonials = defaultTestimonials,
  showStats = true,
  showTestimonials = true 
}: MedicalStatsProps) {
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="webmd-section webmd-section-alt">
      <div className="content-container">
        
        {/* Stats Section */}
        {showStats && (
          <div className="mb-20">
            <div className="webmd-section-header">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="webmd-section-title">
                    Trusted by Healthcare Professionals
                  </h2>
                  <div className="webmd-section-divider-line"></div>
                </div>
              </div>
              <p className="webmd-section-subtitle">
                Our commitment to medical accuracy and evidence-based content has earned the trust of healthcare professionals and patients worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center webmd-card-feature hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {showTestimonials && (
          <div>
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h2 className="medical-heading text-4xl lg:text-5xl mb-6">
                What Healthcare Professionals Say
              </h2>
              <p className="medical-body text-xl max-w-3xl mx-auto">
                Hear from medical experts who trust our platform for accurate, evidence-based health information.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-600 mx-auto mt-8 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="medical-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-8">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V7a1 1 0 112 0v3.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    {/* Content */}
                    <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-blue-600 font-medium">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
