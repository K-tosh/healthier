import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  data: {
    body?: string;
    content?: string;
  } | string;
  dropCap?: boolean;
}

export default function RichText({ data, dropCap = false }: RichTextProps) {
  console.log("🔤 RichText Data:", data);
  
  // Handle cases where data might be a string directly or an object with different structures
  let content = '';
  if (typeof data === 'string') {
    content = data;
  } else if (data && typeof data === 'object') {
    content = data.body || data.content || '';
  }
  
  console.log("📝 Body Content:", content);
  
  if (!content || content.trim() === '') {
    console.warn("⚠️ RichText: No content provided");
    return (
      <section className="richtext-section">
        <div className="richtext-container">
          <div className="medical-card p-8 text-center">
            <p className="medical-text-muted">No content available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="richtext-section">
      <div className="richtext-container">
        <div className={`rich-text prose prose-lg prose-blue max-w-none ${dropCap ? 'prose-drop-cap' : ''}`}>
          <Markdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom components for better styling
              h1: ({ children }) => {
                const text = children?.toString() || '';
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                return (
                  <h1 id={id} className="text-4xl font-bold text-gray-900 mb-6 leading-tight scroll-mt-6">
                    {children}
                  </h1>
                );
              },
              h2: ({ children }) => {
                const text = children?.toString() || '';
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                return (
                  <h2 id={id} className="text-3xl font-bold text-gray-900 mb-5 mt-8 leading-tight scroll-mt-6">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const text = children?.toString() || '';
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                return (
                  <h3 id={id} className="text-2xl font-semibold text-gray-900 mb-4 mt-6 leading-tight scroll-mt-6">
                    {children}
                  </h3>
                );
              },
              h4: ({ children }) => {
                const text = children?.toString() || '';
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                return (
                  <h4 id={id} className="text-xl font-semibold text-gray-900 mb-3 mt-5 leading-tight scroll-mt-6">
                    {children}
                  </h4>
                );
              },
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-lg leading-relaxed">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-4 mb-6 bg-blue-50 rounded-r-lg">
                  <div className="text-gray-800 italic">
                    {children}
                  </div>
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
                  target={href?.startsWith('http') ? '_blank' : '_self'}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-gray-900">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-800">
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
                  {children}
                </pre>
              ),
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>
    </section>
  );
}
