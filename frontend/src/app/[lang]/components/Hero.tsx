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
    <section className="bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <HighlightedText
                text={data.title}
                tag="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 tracking-tight"
                color=""
              />
              
              <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
            </div>

            <HighlightedText
              text={data.description}
              tag="p"
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
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
                    size="lg"
                    asChild
                    className={`font-semibold text-base px-8 py-3 h-auto ${
                      button.type === "secondary" 
                        ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200" 
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    }`}
                  >
                    <span>{button.text}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
              <Image
                src={imgUrl || ""}
                alt={data.picture.data.attributes.alternativeText || "Health illustration"}
                width={600}
                height={500}
                className="relative rounded-2xl object-cover w-full h-auto max-w-lg lg:max-w-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
