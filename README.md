# Otter AI

Otter AI is a clean, privacy-minded AI chat website by Arcbase. It is designed for quick conversations, saved local chat history, and a calm interface that keeps the focus on the conversation.

The site uses OpenRouter through a server-side API route, so the model provider key is never exposed in the browser. The default model is Llama 3.3 70B Instruct.

## What It Does

- Private-feeling AI chat with a simple, focused interface
- Saved conversations on the user's device
- A Chat History setting that clears saved chats and keeps future chats session-only
- Light and dark appearance modes
- Per-chat delete controls and a clear-all chat action
- Code block rendering with a working copy button
- Basic markdown rendering for AI responses
- Optional language/timezone context for better date, time, and locale-aware answers
- Datadog RUM support for production monitoring

## Privacy

Otter AI keeps chat history in the browser with `localStorage` when Chat History is enabled. Turning Chat History off clears saved chats, draft text, and the selected chat reference from local storage.

Approximate Location does not send precise location, city, or address. When enabled, it sends browser language and timezone only. The model is instructed not to infer a location from that context.

OpenRouter requests are handled through the server-side `/api/chat` route. The OpenRouter API key is stored as a server environment variable and is not shipped to the client.

## AI Disclaimer

Otter AI can make mistakes. Consider checking important information.

## Production Services

- AI routing: OpenRouter
- Default model: `meta-llama/llama-3.3-70b-instruct`
- Hosting target: Vercel
- Monitoring: Datadog RUM

## Required Runtime Configuration

Production requires an OpenRouter API key:

```env
OPENROUTER_API_KEY=...
```

Optional production settings:

```env
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct
VITE_DATADOG_APPLICATION_ID=...
VITE_DATADOG_CLIENT_TOKEN=...
VITE_DATADOG_SITE=us5.datadoghq.com
VITE_DATADOG_SERVICE=otterai
VITE_DATADOG_ENV=production
```

Datadog initializes only when both `VITE_DATADOG_APPLICATION_ID` and `VITE_DATADOG_CLIENT_TOKEN` are present.

## License

MIT. See [LICENSE](./LICENSE).
