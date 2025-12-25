import type { Provider, ProviderName } from '../types.js';
import { OpenAIProvider } from './openai.js';
import { OllamaProvider } from './ollama.js';
import { MindRxProvider } from './mindrx.js';
import { AnthropicProvider } from './anthropic.js';
import { GoogleProvider } from './google.js';
import { XAIProvider } from './xai.js';

export { OpenAIProvider } from './openai.js';
export { OllamaProvider } from './ollama.js';
export { MindRxProvider } from './mindrx.js';
export { AnthropicProvider } from './anthropic.js';
export { GoogleProvider } from './google.js';
export { XAIProvider } from './xai.js';

export interface ProviderOptions {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export function createProvider(
  name: ProviderName,
  options: ProviderOptions = {}
): Provider {
  switch (name) {
    case 'openai':
      return new OpenAIProvider(options);
    case 'ollama':
      return new OllamaProvider(options);
    case 'mindrx':
      return new MindRxProvider(options);
    case 'anthropic':
      return new AnthropicProvider(options);
    case 'google':
      return new GoogleProvider(options);
    case 'xai':
      return new XAIProvider(options);
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}
