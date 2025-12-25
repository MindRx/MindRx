import type { StateDefinition, StateBehavior, StateParameters } from 'mindrx-core';

export interface DefineStateInput {
  name: string;
  description?: string;
  parameters?: Partial<StateParameters>;
  behavior?: Partial<StateBehavior>;
  systemPrompt: string;
}

export function defineState(input: DefineStateInput): StateDefinition {
  return {
    name: input.name,
    description: input.description || '',
    parameters: {
      temperature: 0.7,
      ...input.parameters,
    },
    behavior: {
      association: 'normal',
      coherence: 'normal',
      pacing: 'normal',
      confidence: 'normal',
      ...input.behavior,
    },
    system_prompt: input.systemPrompt,
  };
}
