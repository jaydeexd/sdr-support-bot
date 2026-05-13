import CodeBlock from "./CodeBlock";
import type { Message } from "@/types";

type Props = {
  message: Message;
};

function parseTextWithCodeBlocks(text: string) {
  const parts: { type: "text" | "code"; content: string; language?: string }[] =
    [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: "code",
      content: match[2].trimEnd(),
      language: match[1] || undefined,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

function renderText(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

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
            <div className="bg-[#5624d0] text-white px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
              {renderText(textContent)}
            </div>
          )}
        </div>
      </div>
    );
  }

  const parts = parseTextWithCodeBlocks(textContent);

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 leading-relaxed shadow-sm">
        {parts.map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} code={part.content} language={part.language} />
          ) : (
            <span key={i}>{renderText(part.content)}</span>
          )
        )}
      </div>
    </div>
  );
}
