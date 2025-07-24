import Link from "next/link";
import Image from "next/image";
import HighlightedText from "./HighlightedText";
import { getStrapiMedia } from "../utils/api-helpers";
import { Button } from "@/components/ui/button";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

interface Picture {
  data: {
    id: string;
    attributes: {
      url: string;
      name: string;
      alternativeText: string;
    };
  };
}

interface HeroProps {
  data: {
    id: string;
    title: string;
    description: string;
    picture: Picture;
    buttons: Button[];
  };
}

export default function Hero({ data }: HeroProps) {
  const imgUrl = getStrapiMedia(data.picture.data.attributes.url);

  return (
    <section className="webmd-section webmd-section-hero webmd-section-alt relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full blur-3xl opacity-30 translate-y-20 -translate-x-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3">
              <div className="trust-indicator">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Medically Reviewed
              </div>
              <div className="trust-indicator">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Evidence-Based
              </div>
            </div>

            <div className="space-y-6">
              <HighlightedText
                text={data.title}
                tag="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 tracking-tight"
                color="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              />
              
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>

            <HighlightedText
              text={data.description}
              tag="p"
              className="text-xl text-gray-600 leading-relaxed max-w-2xl"
              color=""
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {data.buttons.map((button: Button, index: number) => (
                <Link
                  key={index}
                  href={button.url}
                  target={button.newTab ? "_blank" : "_self"}
                  passHref
                >
                  <Button
                    variant={button.type === "secondary" ? "outline" : "default"}
                    size="xl"
                    asChild
                    className={`font-semibold text-lg px-10 py-4 h-auto ${
                      button.type === "secondary" 
                        ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300" 
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {button.text}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Health Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500K+</div>
                <div className="text-sm text-gray-600">Trusted Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Health Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Expert</div>
                <div className="text-sm text-gray-600">Medical Team</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative medical-card-elevated p-3 rounded-3xl">
                <Image
                  src={imgUrl || ""}
                  alt={data.picture.data.attributes.alternativeText || "Health illustration"}
                  width={600}
                  height={500}
                  className="rounded-2xl object-cover w-full h-auto max-w-lg lg:max-w-xl"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center medical-card">
                <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-24 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center medical-card">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">A+</div>
                  <div className="text-xs text-gray-600">Rated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
