import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleChatRequest } from './api/groq.js';
import handleSearchRequest from './api/search.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  process.env.GROQ_API_KEY ||= env.GROQ_API_KEY;
  process.env.GROQ_MODEL ||= env.GROQ_MODEL;
  process.env.BRAVE_API_KEY ||= env.BRAVE_API_KEY;
  process.env.UPSTASH_REDIS_REST_URL ||= env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_TOKEN ||= env.UPSTASH_REDIS_REST_TOKEN;

  return {
    plugins: [
      react(),
      {
        name: 'otterai-local-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (request, response) => {
            await handleChatRequest(request, response);
          });
          server.middlewares.use('/api/search', async (request, response) => {
            await handleSearchRequest(request, response);
          });
        },
      },
    ],
  };
});
