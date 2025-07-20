import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface FeaturesProps {
  data: {
    heading: string;
    description: string;
    feature: Feature[];
  };
}

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink: boolean;
  newTab: boolean;
  url: string;
  text: string;
}

function Feature({ title, description, showLink, newTab, url, text }: Feature) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-8 h-8 dark:text-blue-400 text-blue-600"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          ></path>
        </svg>
        <CardTitle className="my-2 text-lg font-semibold text-center font-sans tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="prose prose-sm text-gray-700 dark:text-gray-300 font-serif text-center mb-4">{description}</p>
      </CardContent>
      {showLink && url && text && (
        <CardFooter className="justify-center">
          <Link
            href={url}
            target={newTab ? "_blank" : "_self"}
            className="inline-block px-4 py-2 text-sm font-semibold text-white transition duration-200 ease-in-out bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {text}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Features({ data }: FeaturesProps) {
  return (
    <section className="bg-white dark:bg-gray-900 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-2 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight font-sans mb-2">{data.heading}</h2>
        <p className="text-gray-500 dark:text-gray-400 font-serif mb-8">{data.description}</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.feature.map((feature: Feature, index: number) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
