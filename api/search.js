import { sendJson, readJsonBody } from './groq.js';

const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: { message: 'Method not allowed.' } });
    return;
  }

  const apiKey = process.env.BRAVE_API_KEY?.trim();
  if (!apiKey) {
    sendJson(response, 500, {
      error: { message: 'BRAVE_API_KEY is not configured on the server.' },
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

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!query) {
    sendJson(response, 400, { error: { message: 'Query is required.' } });
    return;
  }

  try {
    const searchResponse = await fetch(
      `${BRAVE_API_URL}?q=${encodeURIComponent(query)}&count=5&offset=0&safesearch=off`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey,
        },
      },
    );

    if (!searchResponse.ok) {
      const data = await searchResponse.json().catch(() => ({}));
      sendJson(response, searchResponse.status, {
        error: {
          message: data?.error?.message || `Brave search failed with status ${searchResponse.status}.`,
        },
      });
      return;
    }

    const data = await searchResponse.json();
    const results = (data.web?.results || []).map((result) => ({
      title: result.title || '',
      url: result.url || '',
      description: result.description || '',
    }));

    sendJson(response, 200, { results });
  } catch (error) {
    sendJson(response, 500, {
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'Brave search could not complete the request.',
      },
    });
  }
}
