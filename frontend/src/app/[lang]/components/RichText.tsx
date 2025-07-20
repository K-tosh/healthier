import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  data: {
    body: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  // TODO: STYLE THE MARKDOWN
  return (
    <section className="prose prose-lg max-w-none mt-6 font-serif text-gray-800">
      <Markdown children={data.body} remarkPlugins={[remarkGfm]} />
    </section>
  );
}
