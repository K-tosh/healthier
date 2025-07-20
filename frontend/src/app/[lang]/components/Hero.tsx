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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 text-gray-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-4 py-16 lg:px-6">
        {/* Left Side */}
        <div className="w-full lg:w-1/2">
          <HighlightedText
            text={data.title}
            tag="h1"
            className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4 tracking-tight font-sans text-gray-900 dark:text-white"
            color=""
          />

          <HighlightedText
            text={data.description}
            tag="p"
            className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6 font-serif"
            color=""
          />

          <div className="flex flex-wrap items-center gap-4">
            {data.buttons.map((button: Button, index: number) => (
              <Link
                key={index}
                href={button.url}
                target={button.newTab ? "_blank" : "_self"}
                passHref
              >
                <Button
                  variant={button.type === "secondary" ? "secondary" : "default"}
                  size="lg"
                  asChild
                  className="font-semibold text-base"
                >
                  <span>{button.text}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Image
              src={imgUrl || ""}
              alt={data.picture.data.attributes.alternativeText || "Health illustration"}
              width={600}
              height={600}
              className="rounded-xl shadow-lg object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
