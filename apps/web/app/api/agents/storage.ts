import type { StateDefinition } from 'mindrx-core';

export interface Agent {
  id: string;
  name: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'xai' | 'ollama' | 'mindrx';
  model: string;
  state: string;
  intensity: number;
  systemPrompt: string;
  customState?: StateDefinition;
  apiKey?: string;
  baseUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for demo purposes
// In production, use a database
export const agents = new Map<string, Agent>();