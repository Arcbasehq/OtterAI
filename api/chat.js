import { handleChatRequest } from './groq.js';

export default async function handler(request, response) {
  await handleChatRequest(request, response);
}
