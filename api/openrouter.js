export const OPENROUTER_API_URL =
  'https://openrouter.ai/api/v1/chat/completions';
export const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct';

export function normalizeAssistantContent(content) {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => (part.type === 'text' || !part.type ? part.text || '' : ''))
      .join('')
      .trim();
  }
  return '';
}

export function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

export function readJsonBody(request) {
  if (request.body) return Promise.resolve(request.body);

  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', reject);
  });
}

export async function handleChatRequest(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: { message: 'Method not allowed.' } });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    sendJson(response, 500, {
      error: { message: 'OPENROUTER_API_KEY is not configured on the server.' },
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { error: { message: 'Invalid JSON body.' } });
    return;
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const approximateLocationContext =
    body?.approximateLocationContext &&
    typeof body.approximateLocationContext === 'object'
      ? body.approximateLocationContext
      : null;

  const validMessages = messages
    .filter(
      (message) =>
        message &&
        ['system', 'user', 'assistant'].includes(message.role) &&
        typeof message.content === 'string',
    )
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 12000),
    }));

  if (!validMessages.some((message) => message.role === 'user')) {
    sendJson(response, 400, {
      error: { message: 'At least one user message is required.' },
    });
    return;
  }

  if (
    approximateLocationContext &&
    typeof approximateLocationContext.timezone === 'string'
  ) {
    const language =
      typeof approximateLocationContext.language === 'string'
        ? approximateLocationContext.language.slice(0, 40)
        : 'unknown';
    const timezone = approximateLocationContext.timezone.slice(0, 80);

    validMessages.unshift({
      role: 'system',
      content: `Optional user context: browser language ${language}, timezone ${timezone}. Use this only for time formatting, date awareness, or locale-sensitive wording. This is not a location signal. If asked where the user is, say you do not know their location unless they explicitly shared it. Do not guess a city, province, state, country, or region from this context.`,
    });
  }

  try {
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': request.headers.origin || 'https://otterai.vercel.app',
        'X-OpenRouter-Title': 'Otter AI',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
        messages: validMessages,
        temperature: 0.7,
      }),
    });

    const data = await openRouterResponse.json().catch(() => ({}));

    if (!openRouterResponse.ok) {
      const fallbackMessage =
        openRouterResponse.status === 401
          ? 'OpenRouter rejected the API key. Check OPENROUTER_API_KEY, rotate the exposed key, and restart the dev server.'
          : `OpenRouter request failed with status ${openRouterResponse.status}.`;

      sendJson(response, openRouterResponse.status, {
        error: {
          message:
            data?.error?.message ||
            fallbackMessage,
        },
      });
      return;
    }

    const reply = normalizeAssistantContent(data?.choices?.[0]?.message?.content);
    if (!reply) {
      sendJson(response, 502, {
        error: { message: 'OpenRouter returned an empty response.' },
      });
      return;
    }

    sendJson(response, 200, { reply });
  } catch (error) {
    sendJson(response, 500, {
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'OpenRouter could not complete the request.',
      },
    });
  }
}
