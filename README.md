# Otter AI

Otter AI is a private-feeling AI chat web app built with React, TypeScript, Vite, and Vercel serverless functions. It uses OpenRouter on the server side so API keys are never exposed to the browser.

## Features

- OpenRouter chat completions through `/api/chat`
- Default model: `meta-llama/llama-3.3-70b-instruct`
- Local chat history with a setting to disable and clear saved chats
- Theme, sidebar, draft, active chat, and settings saved to `localStorage`
- Optional language/timezone context for locale-aware answers
- Per-chat delete and clear-all controls

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct
```

Start the dev server:

```bash
npm run dev
```

The Vite dev server includes local middleware for `/api/chat`, so local development behaves like the Vercel deployment.

## Vercel Deployment

Set these environment variables in Vercel:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct
```

`OPENROUTER_MODEL` is optional. If omitted, the server defaults to Llama 3.3 70B Instruct.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Security Notes

- Never commit `.env.local` or real OpenRouter keys.
- Rotate any key that has been pasted into chat, screenshots, logs, or issue trackers.
- Browser `localStorage` is used for chats and settings. Users can disable Chat History in Settings to clear saved chats and keep future chats session-only.

## License

MIT. See [LICENSE](./LICENSE).
