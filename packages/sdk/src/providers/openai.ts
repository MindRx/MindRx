import OpenAI from 'openai';
import type { Provider, CompletionRequest, Response, Chunk } from '../types.js';

export class OpenAIProvider implements Provider {
  name = 'openai';
  private client: OpenAI;
  private defaultModel: string;

  constructor(options: { apiKey?: string; baseUrl?: string; model?: string } = {}) {
    this.client = new OpenAI({
      apiKey: options.apiKey || process.env.OPENAI_API_KEY,
      baseURL: options.baseUrl,
    });
    this.defaultModel = options.model || 'gpt-4o-mini';
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
      frequency_penalty: request.parameters.frequency_penalty,
      presence_penalty: request.parameters.presence_penalty,
      max_tokens: request.parameters.max_tokens,
    });

    const choice = completion.choices[0];

    return {
      text: choice?.message?.content || '',
      state: '', // Will be set by MindRx class
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
      frequency_penalty: request.parameters.frequency_penalty,
      presence_penalty: request.parameters.presence_penalty,
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
