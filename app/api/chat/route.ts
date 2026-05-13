import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type { Message } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as {
      messages: Message[];
      hasImage: boolean;
    };

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages as Anthropic.MessageParam[],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return Response.json({ response: text });
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json(
      { error: "Failed to get response. Please try again." },
      { status: 500 }
    );
  }
}
