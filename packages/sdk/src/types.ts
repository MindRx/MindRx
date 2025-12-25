import type { StateDefinition, StateParameters } from 'mindrx-core';

export type ProviderName = 'openai' | 'anthropic' | 'google' | 'xai' | 'ollama' | 'mindrx';

export interface MindRxOptions {
  state?: string;
  provider?: ProviderName;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  customStates?: StateDefinition[];
}

export interface Response {
  text: string;
  state: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface Chunk {
  text: string;
  done: boolean;
}

export interface CompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  parameters: StateParameters;
  model?: string;
}

export interface Provider {
  name: string;
  complete(request: CompletionRequest): Promise<Response>;
  stream(request: CompletionRequest): AsyncIterable<Chunk>;
}

export type { StateDefinition, StateParameters, StateBehavior, StateInfo } from 'mindrx-core';
