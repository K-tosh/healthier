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
    <section
      className={
        `prose prose-lg max-w-none mt-6 font-serif text-gray-800 dark:text-gray-100 dark:prose-invert prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-700 prose-a:font-semibold hover:prose-a:underline prose-blockquote:border-blue-300 prose-blockquote:text-gray-600 prose-blockquote:italic prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-pink-600 prose-li:marker:text-blue-400 prose-img:rounded-lg prose-img:shadow-sm prose-img:my-4 prose-hr:my-8`
      }
    >
      <Markdown children={data.body} remarkPlugins={[remarkGfm]} />
    </section>
  );
}
