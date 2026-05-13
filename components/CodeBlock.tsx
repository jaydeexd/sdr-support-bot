"use client";

import { useState } from "react";

type Props = {
  code: string;
  language?: string;
};

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg border-2 border-[#5624d0] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#f0ebff]">
        <span className="text-xs font-medium text-[#5624d0]">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-medium px-3 py-1 rounded bg-[#5624d0] text-white hover:bg-[#4a1db0] transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 bg-white overflow-x-auto text-sm text-gray-800 font-mono whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}
