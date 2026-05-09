import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleChatRequest } from './api/openrouter.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  process.env.OPENROUTER_API_KEY ||= env.OPENROUTER_API_KEY;
  process.env.OPENROUTER_MODEL ||= env.OPENROUTER_MODEL;

  return {
    plugins: [
      react(),
      {
        name: 'otterai-local-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (request, response) => {
            await handleChatRequest(request, response);
          });
        },
      },
    ],
  };
});
