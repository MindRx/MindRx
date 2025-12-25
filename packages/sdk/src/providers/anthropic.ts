import Anthropic from '@anthropic-ai/sdk';
import type { Provider, CompletionRequest, Response, Chunk } from '../types.js';

export class AnthropicProvider implements Provider {
  name = 'anthropic';
  private client: Anthropic;
  private defaultModel: string;

  constructor(options: { apiKey?: string; model?: string } = {}) {
    this.client = new Anthropic({
      apiKey: options.apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.defaultModel = options.model || 'claude-3-5-sonnet-20241022';
  }

  async complete(request: CompletionRequest): Promise<Response> {
    const model = request.model || this.defaultModel;

    const message = await this.client.messages.create({
      model,
      max_tokens: request.parameters.max_tokens || 4096,
      system: request.systemPrompt,
      messages: [{ role: 'user', content: request.userPrompt }],
      temperature: request.parameters.temperature,
      top_p: request.parameters.top_p,
    });

    const textContent = message.content.find((c) => c.type === 'text');

    return {
      text: textContent?.type === 'text' ? textContent.text : '',
      state: '',
      model,
      usage: {
        promptTokens: message.usage.input_tokens,
        completionTokens: message.usage.output_tokens,
        totalTokens: message.usage.input_tokens + message.usage.output_tokens,
      },
    };
  }

  async *stream(request: CompletionRequest): AsyncIterable<Chunk> {
    const model = request.model || this.defaultModel;

    const stream = this.client.messages.stream({
      model,
      max_tokens: request.parameters.max_tokens || 4096,
      system: request.systemPrompt,
      messages: [{ role: 'user', content: request.userPrompt }],
      temperature: request.parameters.temperature,
      top_p: request.parameters.top_p,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { text: event.delta.text, done: false };
      } else if (event.type === 'message_stop') {
        yield { text: '', done: true };
      }
    }
  }
}
