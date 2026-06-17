# Quokka AI

Quokka AI is a clean, privacy-minded AI chat website by Arcbase. It is designed for quick conversations, saved local chat history, and a calm interface that keeps the focus on the conversation.

The site uses Groq through a server-side API route, so the model provider key is never exposed in the browser. The default model is Llama 3.3 70B Versatile.

## What It Does

- Private-feeling AI chat with a simple, focused interface
- Saved conversations on the user's device
- A Chat History setting that clears saved chats and keeps future chats session-only
- Light and dark appearance modes
- Per-chat delete controls and a clear-all chat action
- Code block rendering with a working copy button
- Basic markdown rendering for AI responses
- Optional language/timezone context for better date, time, and locale-aware answers
- Umami Analytics for privacy-friendly usage monitoring

## Privacy

Quokka AI keeps chat history in the browser with `localStorage` when Chat History is enabled. Turning Chat History off clears saved chats, draft text, and the selected chat reference from local storage.

Approximate Location does not send precise location, city, or address. When enabled, it sends browser language and timezone only. The model is instructed not to infer a location from that context.

Groq requests are handled through the server-side `/api/chat` route. The Groq API key is stored as a server environment variable and is not shipped to the client.

## AI Disclaimer

Quokka AI can make mistakes. Consider checking important information.

## Production Services

- AI routing: Groq
- Default model: `llama-3.3-70b-versatile`
- Hosting target: Vercel
- Monitoring: Umami Analytics

## Required Runtime Configuration

Production requires a Groq API key:

```env
GROQ_API_KEY=...
```

Optional production settings:

```env
GROQ_MODEL=llama-3.3-70b-versatile
UPSTASH_REDIS_REST_URL=...        # Upstash Redis REST URL for rate limiting
UPSTASH_REDIS_REST_TOKEN=...      # Upstash Redis REST token
```

Umami Analytics is loaded via a script tag in `index.html`.
Redis rate limiting is optional — the app works without it.

## License

MIT. See [LICENSE](./LICENSE).
