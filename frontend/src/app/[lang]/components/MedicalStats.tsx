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
      <div
        key={index}
        className={`w-4 h-4 rounded-full ${index < rating ? 'bg-yellow-400' : 'bg-gray-300'}`}
      />
    ));
  };

  return (
    <section className="healthier-section healthier-section-alt">
      <div className="content-container">
        
        {/* Stats Section */}
        {showStats && (
          <div className="mb-20">
            <div className="healthier-section-header">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                  {/* Icon placeholder - no SVG icon */}
                </div>
                <div>
                  <h2 className="healthier-section-title">
                    Trusted by Healthcare Professionals
                  </h2>
                  <div className="healthier-section-divider-line"></div>
                </div>
              </div>
              <p className="healthier-section-subtitle">
                Our commitment to medical accuracy and evidence-based content has earned the trust of healthcare professionals and patients worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center healthier-card-feature hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
                  {/* Icon placeholder - no SVG icon */}
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
                      {/* Icon placeholder - no SVG icon */}
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
