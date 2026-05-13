# SDR Support Bot — Architecture Notes

## What this app does
Internal chatbot for Kevin and Katie (CNX SDR team, Vietnam) to get instant answers about SFDC routing, ROE, territory rules, objection handling, and Udemy Business sales processes. Supports image uploads (SFDC screenshots) for visual analysis.

## Tech stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- `@anthropic-ai/sdk` — server-side only
- React 19

## Key files

| File | Purpose |
|---|---|
| `lib/system-prompt.ts` | The bot's entire knowledge base. Edit this to update what the bot knows. |
| `app/api/chat/route.ts` | Server-side API route — the only place the Anthropic SDK is called. `ANTHROPIC_API_KEY` never reaches the browser. |
| `components/ChatInterface.tsx` | All client-side UX: messages, image upload, drag-and-drop, chips, loading states. |
| `components/MessageBubble.tsx` | Renders user/bot messages; parses code blocks in bot responses. |
| `components/CodeBlock.tsx` | Purple-accented code block with copy button. |
| `components/SuggestedChips.tsx` | 12 quick-start question chips shown on empty state. |
| `types/index.ts` | Shared TypeScript types for `Message`, `ContentBlock`, `PendingImage`. |

## Model & API settings
- Model: `claude-sonnet-4-6`
- Max tokens: `1500`
- No streaming (standard `messages.create()` call)
- System prompt passed as `system` parameter, not prepended to messages

## Updating the knowledge base
1. Open `lib/system-prompt.ts`
2. Edit the `SYSTEM_PROMPT` string
3. `git add lib/system-prompt.ts && git commit -m "Update system prompt: <what changed>"`
4. `git push` — Vercel auto-redeploys in ~30s

No server restart needed.

## Image handling
- Client reads image file → base64 via `FileReader`
- Sent to `/api/chat` as part of the messages array
- API route forwards as `{ type: "image", source: { type: "base64", media_type, data } }` content block
- Claude's vision capability analyses the screenshot

## Phase 2 (not yet built)
- "Refresh Knowledge" button currently shows a toast stub
- Future: fetch `GOOGLE_SERVICE_ACCOUNT_KEY` env var, pull latest MasterDoc from Google Drive, update system prompt dynamically
