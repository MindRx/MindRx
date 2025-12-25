export type ProviderName = 'mindrx' | 'openai' | 'anthropic' | 'google' | 'xai' | 'ollama';

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface StateInfo {
  name: string;
  description: string;
  parameters: StateParameters;
  behavior: StateBehavior;
}

export interface StateParameters {
  temperature: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
}

export interface StateBehavior {
  association: 'tight' | 'normal' | 'loose' | 'fragmented';
  coherence: 'strict' | 'normal' | 'drifting' | 'dissolving';
  pacing: 'slow' | 'normal' | 'fast' | 'erratic';
  confidence: 'low' | 'normal' | 'high' | 'inflated';
}

export interface ChatRequest {
  message: string;
  profile: string;
  intensity: number;
  provider: ProviderName;
  model?: string;
  apiKey?: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface SSEEvent {
  type: 'start' | 'chunk' | 'done' | 'error';
  text?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export type ConnectionStatus = 'connected' | 'streaming' | 'error' | 'idle';

export interface ProviderConfig {
  value: ProviderName;
  label: string;
  description: string;
  requiresApiKey: boolean;
  defaultModel: string;
  placeholder: string;
}

export const PROVIDERS: ProviderConfig[] = [
  { value: 'mindrx', label: 'MindRx', description: 'Free hosted backend', requiresApiKey: false, defaultModel: 'default', placeholder: 'default' },
  { value: 'openai', label: 'OpenAI', description: 'GPT-4o, GPT-4, etc.', requiresApiKey: true, defaultModel: 'gpt-4o-mini', placeholder: 'gpt-4o-mini' },
  { value: 'anthropic', label: 'Claude', description: 'Claude 3.5, Claude 3, etc.', requiresApiKey: true, defaultModel: 'claude-3-5-sonnet-20241022', placeholder: 'claude-3-5-sonnet-20241022' },
  { value: 'google', label: 'Gemini', description: 'Gemini Pro, Flash, etc.', requiresApiKey: true, defaultModel: 'gemini-1.5-flash', placeholder: 'gemini-1.5-flash' },
  { value: 'xai', label: 'Grok', description: 'Grok-2, Grok-beta', requiresApiKey: true, defaultModel: 'grok-2-latest', placeholder: 'grok-2-latest' },
  { value: 'ollama', label: 'Ollama', description: 'Local models', requiresApiKey: false, defaultModel: 'llama3.2', placeholder: 'llama3.2' },
];

export const DEFAULT_PROFILES: StateInfo[] = [
  { name: 'sober', description: 'Baseline — clear, rational, structured', parameters: { temperature: 0.7, top_p: 1.0, frequency_penalty: 0.0, presence_penalty: 0.0 }, behavior: { association: 'normal', coherence: 'strict', pacing: 'normal', confidence: 'normal' } },
  { name: 'cannabis', description: 'Relaxed associations, tangential thinking', parameters: { temperature: 1.1, top_p: 0.95, frequency_penalty: 0.2, presence_penalty: 0.1 }, behavior: { association: 'loose', coherence: 'drifting', pacing: 'slow', confidence: 'normal' } },
  { name: 'ketamine', description: 'Dissociative, fragmented, void-adjacent', parameters: { temperature: 1.4, top_p: 0.9, frequency_penalty: 0.3, presence_penalty: 0.2 }, behavior: { association: 'fragmented', coherence: 'dissolving', pacing: 'slow', confidence: 'low' } },
  { name: 'cocaine', description: 'Accelerated reasoning, high confidence', parameters: { temperature: 0.9, top_p: 0.85, frequency_penalty: 0.1, presence_penalty: 0.0 }, behavior: { association: 'tight', coherence: 'strict', pacing: 'fast', confidence: 'inflated' } },
  { name: 'ayahuasca', description: 'Deep introspection, cosmic framing', parameters: { temperature: 1.3, top_p: 0.92, frequency_penalty: 0.25, presence_penalty: 0.15 }, behavior: { association: 'loose', coherence: 'drifting', pacing: 'slow', confidence: 'normal' } },
  { name: 'mdma', description: 'Emphatic, connective, emotionally warm', parameters: { temperature: 1.0, top_p: 0.9, frequency_penalty: 0.15, presence_penalty: 0.1 }, behavior: { association: 'normal', coherence: 'normal', pacing: 'normal', confidence: 'high' } },
  { name: 'alcohol', description: 'Loosened inhibition, casual tone', parameters: { temperature: 1.2, top_p: 0.95, frequency_penalty: 0.1, presence_penalty: 0.05 }, behavior: { association: 'loose', coherence: 'drifting', pacing: 'normal', confidence: 'high' } },
  { name: 'lsd', description: 'Synesthetic associations, boundary dissolution', parameters: { temperature: 1.5, top_p: 0.88, frequency_penalty: 0.35, presence_penalty: 0.25 }, behavior: { association: 'fragmented', coherence: 'dissolving', pacing: 'erratic', confidence: 'normal' } },
  { name: 'caffeine', description: 'Focused, alert, slightly anxious', parameters: { temperature: 0.8, top_p: 0.9, frequency_penalty: 0.05, presence_penalty: 0.0 }, behavior: { association: 'tight', coherence: 'strict', pacing: 'fast', confidence: 'normal' } },
];
