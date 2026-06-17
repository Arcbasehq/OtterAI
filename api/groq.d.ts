import type { IncomingMessage, ServerResponse } from 'node:http';

export function handleChatRequest(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse,
): Promise<void>;
