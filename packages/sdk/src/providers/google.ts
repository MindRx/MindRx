import OpenAI from 'openai';
import type { Provider, CompletionRequest, Response, Chunk } from '../types.js';

export class GoogleProvider implements Provider {
  name = 'google';
  private client: OpenAI;
  private defaultModel: string;

  constructor(options: { apiKey?: string; model?: string } = {}) {
    const apiKey = options.apiKey || process.env.GOOGLE_API_KEY;
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    });
    this.defaultModel = options.model || 'gemini-1.5-flash';
  }

  async complete(request: CompletionRequest): Promise<Response> {
    const model = request.model || this.defaultModel;

    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      temperature: request.parameters.temperature,
      top_p: request.parameters.top_p,
      max_tokens: request.parameters.max_tokens,
    });

    const choice = completion.choices[0];

    return {
      text: choice?.message?.content || '',
      state: '',
      model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }

  async *stream(request: CompletionRequest): AsyncIterable<Chunk> {
    const model = request.model || this.defaultModel;

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      temperature: request.parameters.temperature,
      top_p: request.parameters.top_p,
      max_tokens: request.parameters.max_tokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      const done = chunk.choices[0]?.finish_reason !== null;

      if (delta || done) {
        yield { text: delta, done };
      }
    }
  }
}
