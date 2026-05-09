# Security Policy

## Supported Versions

Security updates are provided for the latest released version of Otter AI.

## Reporting a Vulnerability

If you discover a vulnerability, please report it privately to the project owner or maintainer. Do not open a public issue with exploit details, secrets, API keys, or user data.

Please include:

- A short description of the issue
- Steps to reproduce
- The affected route, component, or configuration
- Any relevant logs with secrets removed

## Secret Handling

- Store OpenRouter credentials only in environment variables.
- Use `OPENROUTER_API_KEY` on Vercel or in local `.env.local`.
- Never expose OpenRouter keys through `VITE_` variables, client code, screenshots, logs, or commits.
- Rotate any key that may have been shared or committed.

## User Data

Chats and settings are stored in browser `localStorage` when Chat History is enabled. Turning Chat History off clears saved chats, draft text, and the active chat reference from local storage.

Approximate Location does not send precise location, city, or address. When enabled, it sends browser language and timezone only, and the server instructs the model not to infer a location from that context.

## Deployment Checklist

- Confirm `.env.local` is not committed.
- Set `OPENROUTER_API_KEY` in Vercel.
- Rotate any exposed API key before release.
- Run `npm run build` and `npm run lint` before deploying.
