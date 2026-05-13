"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import type { Message } from "@/types";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  const textContent = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");

  const imageBlocks = message.content.filter((b) => b.type === "image");

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%]">
          {imageBlocks.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 justify-end">
              {imageBlocks.map((b, i) =>
                b.type === "image" ? (
                  <img
                    key={i}
                    src={`data:${b.source.media_type};base64,${b.source.data}`}
                    alt="Uploaded screenshot"
                    className="max-h-40 rounded-lg border border-[#5624d0]/30"
                  />
                ) : null
              )}
            </div>
          )}
          {textContent && (
            <div className="bg-[#5624d0] text-white px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed whitespace-pre-wrap">
              {textContent}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 shadow-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-base font-bold mt-3 mb-1 text-gray-900">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-bold mt-3 mb-1 text-gray-900">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold mt-2 mb-1 text-gray-900">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-outside pl-5 mb-2 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside pl-5 mb-2 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic">{children}</em>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5624d0] underline hover:text-[#4a1db0]"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="my-3 border-gray-200" />,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#5624d0] pl-3 my-2 text-gray-600 italic">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-3">
                <table className="min-w-full border border-gray-200 rounded-lg text-xs">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-[#f0ebff]">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left font-semibold text-[#5624d0] border-b border-gray-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border-b border-gray-100">{children}</td>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code
                    className="bg-[#f0ebff] text-[#5624d0] px-1.5 py-0.5 rounded text-xs font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              const language = className?.replace("language-", "");
              return (
                <CodeBlock
                  code={String(children).trimEnd()}
                  language={language}
                />
              );
            },
            pre: ({ children }) => <>{children}</>,
          }}
        >
          {textContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
