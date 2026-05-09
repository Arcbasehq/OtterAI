# Otter AI

Otter AI is a private-feeling AI chat web app built with React, TypeScript, Vite, and Vercel serverless functions. It uses OpenRouter on the server side so API keys are never exposed to the browser.

## Features

- OpenRouter chat completions through `/api/chat`
- Default model: `meta-llama/llama-3.3-70b-instruct`
- Local chat history with a setting to disable and clear saved chats
- Theme, sidebar, draft, active chat, and settings saved to `localStorage`
- Optional language/timezone context for locale-aware answers
- Per-chat delete and clear-all controls
- Optional Datadog RUM browser monitoring

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct

VITE_DATADOG_APPLICATION_ID=your-datadog-rum-application-id
VITE_DATADOG_CLIENT_TOKEN=your-datadog-client-token
VITE_DATADOG_SITE=datadoghq.com
VITE_DATADOG_SERVICE=otterai
VITE_DATADOG_ENV=development
VITE_DATADOG_SESSION_SAMPLE_RATE=100
VITE_DATADOG_SESSION_REPLAY_SAMPLE_RATE=0
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

VITE_DATADOG_APPLICATION_ID=your-datadog-rum-application-id
VITE_DATADOG_CLIENT_TOKEN=your-datadog-client-token
VITE_DATADOG_SITE=datadoghq.com
VITE_DATADOG_SERVICE=otterai
VITE_DATADOG_ENV=production
VITE_DATADOG_VERSION=1.0.0
VITE_DATADOG_SESSION_SAMPLE_RATE=100
VITE_DATADOG_SESSION_REPLAY_SAMPLE_RATE=0
VITE_DATADOG_START_SESSION_REPLAY=false
```

`OPENROUTER_MODEL` is optional. If omitted, the server defaults to Llama 3.3 70B Instruct.
Datadog is optional. RUM initializes only when `VITE_DATADOG_APPLICATION_ID` and `VITE_DATADOG_CLIENT_TOKEN` are set.

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
- Datadog browser client tokens are intended for client-side use, but keep admin/API keys out of `VITE_` variables.
- Browser `localStorage` is used for chats and settings. Users can disable Chat History in Settings to clear saved chats and keep future chats session-only.

## License

MIT. See [LICENSE](./LICENSE).
