import type { Provider, CompletionRequest, Response, Chunk } from '../types.js';

const MINDRX_API_URL = 'http://72.60.110.67:11434';
const DEFAULT_MODEL = 'qwen2:0.5b';

interface OllamaResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaStreamChunk {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class MindRxProvider implements Provider {
  name = 'mindrx';
  private baseUrl: string;
  private defaultModel: string;

  constructor(options: { baseUrl?: string; model?: string } = {}) {
    this.baseUrl = options.baseUrl || MINDRX_API_URL;
    this.defaultModel = options.model || DEFAULT_MODEL;
  }

  async complete(request: CompletionRequest): Promise<Response> {
    const model = request.model || this.defaultModel;

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userPrompt },
        ],
        options: {
          temperature: request.parameters.temperature,
          top_p: request.parameters.top_p,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`MindRx API error: ${response.status} - ${text}`);
    }

    const data = (await response.json()) as OllamaResponse;

    return {
      text: data.message?.content || '',
      state: '',
      model: 'mindrx',
      usage: data.prompt_eval_count && data.eval_count
        ? {
            promptTokens: data.prompt_eval_count,
            completionTokens: data.eval_count,
            totalTokens: data.prompt_eval_count + data.eval_count,
          }
        : undefined,
    };
  }

  async *stream(request: CompletionRequest): AsyncIterable<Chunk> {
    const model = request.model || this.defaultModel;

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userPrompt },
        ],
        options: {
          temperature: request.parameters.temperature,
          top_p: request.parameters.top_p,
        },
        stream: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`MindRx API error: ${response.status} - ${text}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const chunk = JSON.parse(line) as OllamaStreamChunk;
            yield {
              text: chunk.message?.content || '',
              done: chunk.done,
            };
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }
  }
}
