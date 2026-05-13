"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import SuggestedChips from "./SuggestedChips";
import type { Message, PendingImage } from "@/types";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const readImageFile = useCallback((file: File): Promise<PendingImage> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File must be an image"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const data = result.split(",")[1];
        resolve({ name: file.name, media_type: file.type, data });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = await readImageFile(file);
      setPendingImage(img);
    } catch {
      setError("Could not read image file.");
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    try {
      const img = await readImageFile(file);
      setPendingImage(img);
    } catch {
      setError("Could not read image file.");
    }
  };

  const handleSubmit = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText && !pendingImage) return;
    if (isLoading) return;

    setError(null);

    const userContent: Message["content"] = [];
    if (pendingImage) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: pendingImage.media_type,
          data: pendingImage.data,
        },
      });
    }
    if (messageText) {
      userContent.push({ type: "text", text: messageText });
    }

    const userMessage: Message = { role: "user", content: userContent };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setPendingImage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          hasImage: !!pendingImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: [{ type: "text", text: data.response }],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipSelect = (chip: string) => {
    handleSubmit(chip);
  };

  const handleRefreshKnowledge = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setPendingImage(null);
    setError(null);
  };

  const canSend = (input.trim().length > 0 || !!pendingImage) && !isLoading;

  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-[#5624d0]/10 border-4 border-dashed border-[#5624d0] pointer-events-none flex items-center justify-center">
          <p className="text-[#5624d0] text-xl font-semibold bg-white px-6 py-3 rounded-lg shadow">
            Drop screenshot here
          </p>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-4 right-4 z-50 bg-[#5624d0] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
          Knowledge refreshed ✓
        </div>
      )}

      {/* Header */}
      <header className="bg-[#5624d0] text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
          title="New chat"
        >
          <div>
            <h1 className="font-semibold text-lg leading-tight">SDR Support Bot</h1>
            <p className="text-purple-200 text-xs">
              Udemy Business APAC · Routing, ROE &amp; objections
            </p>
          </div>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
            CNX Team
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors font-medium flex items-center gap-1.5"
            title="Start a new chat"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
          <button
            onClick={handleRefreshKnowledge}
            className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors font-medium"
          >
            Refresh Knowledge
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {messages.length === 0 && !isLoading ? (
          <SuggestedChips onSelect={handleChipSelect} />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 rounded-full bg-[#5624d0] animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-[#5624d0] animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-[#5624d0] animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg max-w-md text-center">
                  {error}{" "}
                  <button
                    onClick={() => setError(null)}
                    className="underline font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          {pendingImage && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="flex items-center gap-2 bg-[#f0ebff] border border-[#5624d0] rounded-full px-3 py-1 text-xs text-[#5624d0]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="max-w-[200px] truncate">{pendingImage.name}</span>
                <button
                  onClick={() => setPendingImage(null)}
                  className="ml-1 hover:text-[#3d1a8e] font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Paperclip */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-[#5624d0] bg-[#f0ebff] hover:bg-[#e5d9ff] transition-colors"
              title="Upload screenshot"
            >
              <svg className="w-5 h-5 text-[#5624d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about routing, ROE, objections..."
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5624d0] focus:border-transparent max-h-32 overflow-y-auto"
              style={{ lineHeight: "1.5" }}
            />

            {/* Send button */}
            <button
              onClick={() => handleSubmit()}
              disabled={!canSend}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#5624d0] text-white hover:bg-[#4a1db0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            Internal use only · Udemy Business APAC · Drag &amp; drop screenshots anywhere
          </p>
        </div>
      </div>
    </div>
  );
}
