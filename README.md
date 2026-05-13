# SDR Support Bot

Internal knowledge-base chatbot for the Udemy Business APAC CNX SDR team. Answers questions about SFDC routing, ROE, territory rules, objection handling, and sales processes. Supports SFDC screenshot uploads for visual analysis.

## Local setup

**1. Install dependencies**
```bash
npm install
```

**2. Add your API key**

Copy `.env.local.example` to `.env.local` and fill in your key:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```
Get your key from [console.anthropic.com](https://console.anthropic.com) → API Keys.

**3. Run the dev server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub (create a **private** repo named `sdr-support-bot`)
2. Go to [vercel.com](https://vercel.com) → Add New → Project → import your repo
3. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` → your key from console.anthropic.com
4. Click **Deploy**

Vercel gives you a URL like `sdr-support-bot.vercel.app` — share this with Kevin and Katie.

## Updating the knowledge base

All bot knowledge lives in `lib/system-prompt.ts`. To update:

1. Edit `lib/system-prompt.ts`
2. Commit and push:
```bash
git add lib/system-prompt.ts
git commit -m "Update system prompt: <what changed>"
git push
```
Vercel auto-redeploys in ~30 seconds. No restart needed.

## Connect to GitHub (first time)

```bash
# Create a new private repo on github.com named sdr-support-bot, then:
git remote add origin https://github.com/YOUR_USERNAME/sdr-support-bot.git
git push -u origin main
```
