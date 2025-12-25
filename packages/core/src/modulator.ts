import type { StateDefinition, ModulatedRequest } from './types.js';

export class Modulator {
  modulate(prompt: string, state: StateDefinition): ModulatedRequest {
    const systemPrompt = this.buildSystemPrompt(state);

    return {
      systemPrompt,
      userPrompt: prompt,
      parameters: { ...state.parameters },
    };
  }

  private buildSystemPrompt(state: StateDefinition): string {
    const parts: string[] = [];

    // Add the state's custom system prompt
    if (state.system_prompt) {
      parts.push(state.system_prompt.trim());
    }

    // Add behavioral guidance based on behavior settings
    const behaviorGuidance = this.getBehaviorGuidance(state);
    if (behaviorGuidance) {
      parts.push(behaviorGuidance);
    }

    return parts.join('\n\n');
  }

  private getBehaviorGuidance(state: StateDefinition): string {
    const guidance: string[] = [];
    const { behavior } = state;

    // Association patterns
    switch (behavior.association) {
      case 'tight':
        guidance.push('Stay closely focused on the topic. Avoid tangents.');
        break;
      case 'loose':
        guidance.push('Allow your thoughts to wander to related topics.');
        break;
      case 'fragmented':
        guidance.push('Let ideas emerge disconnected, jumping between concepts.');
        break;
    }

    // Coherence patterns
    switch (behavior.coherence) {
      case 'strict':
        guidance.push('Maintain strict logical consistency throughout.');
        break;
      case 'drifting':
        guidance.push('Let coherence drift occasionally. Some ideas may not fully connect.');
        break;
      case 'dissolving':
        guidance.push('Coherence is optional. Embrace contradiction and paradox.');
        break;
    }

    // Pacing
    switch (behavior.pacing) {
      case 'slow':
        guidance.push('Take your time. Pause between thoughts. Be deliberate.');
        break;
      case 'fast':
        guidance.push('Move quickly between ideas. Keep momentum high.');
        break;
      case 'erratic':
        guidance.push('Vary your pacing unpredictably. Speed up, slow down, pause.');
        break;
    }

    // Confidence
    switch (behavior.confidence) {
      case 'low':
        guidance.push('Express uncertainty. Question your own assertions.');
        break;
      case 'high':
        guidance.push('Speak with conviction. Trust your insights.');
        break;
      case 'inflated':
        guidance.push('You are certain. Your ideas are brilliant. Express this.');
        break;
    }

    if (guidance.length === 0) {
      return '';
    }

    return guidance.join(' ');
  }
}
