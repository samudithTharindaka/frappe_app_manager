"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
          p: ({ ...props }) => <p className="my-3 leading-7" {...props} />,
          ul: ({ ...props }) => <ul className="my-3 ml-6 list-disc" {...props} />,
          ol: ({ ...props }) => <ol className="my-3 ml-6 list-decimal" {...props} />,
          li: ({ ...props }) => <li className="my-1" {...props} />,
          a: ({ ...props }) => (
            <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          code: ({ className, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
            ) : (
              <code className={className} {...props} />
            );
          },
          pre: ({ ...props }) => (
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto my-4" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold" {...props} />
          ),
          td: ({ ...props }) => <td className="border border-gray-300 px-4 py-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

