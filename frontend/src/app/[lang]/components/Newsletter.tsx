"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  showBenefits?: boolean;
}

const benefits = [
  {
    icon: "📧",
    text: "Weekly health tips and insights"
  },
  {
    icon: "🏥",
    text: "Latest medical research updates"
  },
  {
    icon: "💊",
    text: "Preventive care reminders"
  },
  {
    icon: "🔒",
    text: "Privacy-first, no spam guarantee"
  }
];

export default function Newsletter({
  title = "Stay Informed About Your Health",
  description = "Get evidence-based health insights delivered to your inbox. Join thousands of others who trust us for reliable medical information.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe Now",
  showBenefits = true
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus("success");
      setMessage("Thank you! You've been subscribed to our newsletter.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="webmd-section section-transition webmd-section-alt">
      <div className="content-container">
        <div className="max-w-4xl mx-auto">
          <Card className="webmd-card-feature overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full blur-3xl"></div>
            </div>
            
            <CardContent className="relative p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="space-y-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="webmd-section-title text-3xl lg:text-4xl mb-4">
                      {title}
                    </h2>
                    <p className="webmd-section-subtitle text-lg leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Benefits */}
                  {showBenefits && (
                    <div className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-lg">
                            {benefit.icon}
                          </div>
                          <span className="text-gray-700 font-medium">{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Side */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholder}
                        disabled={status === "loading"}
                        className="h-14 text-lg"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="xl"
                      disabled={status === "loading"}
                      className="w-full"
                    >
                      {status === "loading" ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </div>
                      ) : (
                        buttonText
                      )}
                    </Button>
                  </form>

                  {/* Status Message */}
                  {message && (
                    <div className={`p-4 rounded-lg text-sm font-medium ${
                      status === "success" 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        {status === "success" ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {message}
                      </div>
                    </div>
                  )}

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By subscribing, you agree to our{" "}
                    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    You can unsubscribe at any time. We respect your privacy and never share your information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
