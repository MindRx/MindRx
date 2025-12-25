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

export interface StateDefinition {
  name: string;
  description: string;
  parameters: StateParameters;
  behavior: StateBehavior;
  system_prompt: string;
}

export interface ModulatedRequest {
  systemPrompt: string;
  userPrompt: string;
  parameters: StateParameters;
}

export interface StateInfo {
  name: string;
  description: string;
}

export interface LLMParameters {
  temperature: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens?: number;
}
