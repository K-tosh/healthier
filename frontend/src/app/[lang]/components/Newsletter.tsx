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
    <section className="webmd-section webmd-section-alt">
      <div className="content-container">
        <div className="max-w-5xl mx-auto">
          <Card className="webmd-card-feature overflow-hidden relative border-0 shadow-xl">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full blur-3xl"></div>
            </div>
            
            <CardContent className="relative p-8 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="space-y-8">
                  {/* Enhanced Icon with WebMD-style */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Enhanced Title & Description */}
                  <div>
                    <h2 className="webmd-section-title text-3xl lg:text-4xl mb-6 leading-tight">
                      {title}
                    </h2>
                    <div className="webmd-section-divider-line mb-6"></div>
                    <p className="webmd-section-subtitle text-xl leading-relaxed text-gray-600">
                      {description}
                    </p>
                  </div>

                  {/* Enhanced Benefits with WebMD styling */}
                  {showBenefits && (
                    <div className="space-y-5">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                            {benefit.icon}
                          </div>
                          <span className="text-gray-800 font-semibold text-lg">{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Form Side */}
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/30 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={placeholder}
                          disabled={status === "loading"}
                          className="h-16 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white/90"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        size="xl"
                        disabled={status === "loading"}
                        className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {status === "loading" ? (
                          <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subscribing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {buttonText}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        )}
                      </Button>
                    </form>

                    {/* Enhanced Status Message */}
                    {message && (
                      <div className={`mt-6 p-4 rounded-xl text-sm font-semibold border-2 ${
                        status === "success" 
                          ? "bg-green-50 text-green-800 border-green-200" 
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}>
                        <div className="flex items-center gap-3">
                          {status === "success" ? (
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {message}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Privacy Note */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-800 leading-relaxed flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>
                          <strong>Privacy Protected:</strong> By subscribing, you agree to our{" "}
                          <a href="/privacy" className="text-blue-700 hover:underline font-semibold">Privacy Policy</a>.
                          You can unsubscribe at any time. We respect your privacy and never share your information.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
