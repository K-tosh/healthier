import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";

interface MediaProps {
  file: {
    data: {
      id: string;
      attributes: {
        url: string;
        name: string;
        alternativeText: string;
      };
    };
  };
}

export default function Media({ data }: { data: MediaProps }) {
  const imgUrl = getStrapiMedia(data.file.data.attributes.url);
  return (
    <div className="flex items-center justify-center">
      <Image
        src={imgUrl || ""}
        alt={data.file.data.attributes.alternativeText || "none provided"}
        className="object-cover w-full h-auto rounded-lg shadow-sm mb-4"
        width={800}
        height={500}
      />
    </div>
  );
}