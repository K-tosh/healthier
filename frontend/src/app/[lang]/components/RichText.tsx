import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  data: {
    body: string;
  };
  dropCap?: boolean;
}

export default function RichText({ data }: RichTextProps) {
  return (
    <section className="max-w-4xl mx-auto py-8">
      <div className="medical-card p-8">
        <div className="rich-text prose prose-lg max-w-none">
          <Markdown children={data.body} remarkPlugins={[remarkGfm]} />
        </div>
      </div>
    </section>
  );
}
