import { MindRx } from 'mindrx';
import type { ChatRequest, SSEEvent } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function createSSEMessage(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, profile, provider, model, apiKey, history } = body;

    const agent = new MindRx({
      state: profile,
      provider: provider,
      model: model,
      apiKey: apiKey,
    });

    let fullPrompt = message;
    if (history && history.length > 0) {
      const historyText = history
        .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
        .join('\n\n');
      fullPrompt = `Previous conversation:\n${historyText}\n\nUser: ${message}`;
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(createSSEMessage({ type: 'start' })));
          for await (const chunk of agent.stream(fullPrompt)) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(createSSEMessage({ type: 'chunk', text: chunk.text })));
            }
            if (chunk.done) {
              controller.enqueue(encoder.encode(createSSEMessage({ type: 'done' })));
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(encoder.encode(createSSEMessage({ type: 'error', error: errorMessage })));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
