import { handleChatRequest } from './openrouter.js';

export default async function handler(request, response) {
  await handleChatRequest(request, response);
}
