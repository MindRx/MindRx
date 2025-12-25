import { StateLoader } from './loader.js';
import { Modulator } from './modulator.js';
import type { StateDefinition, ModulatedRequest, StateInfo } from './types.js';

export class StateEngine {
  private loader: StateLoader;
  private modulator: Modulator;
  private currentState: StateDefinition | null = null;

  constructor() {
    this.loader = new StateLoader();
    this.modulator = new Modulator();
  }

  load(name: string): StateDefinition {
    const state = this.loader.get(name);
    if (!state) {
      throw new Error(`State "${name}" not found. Available: ${this.loader.listNames().join(', ')}`);
    }
    this.currentState = state;
    return state;
  }

  getCurrent(): StateDefinition | null {
    return this.currentState;
  }

  apply(prompt: string, stateName?: string): ModulatedRequest {
    let state = this.currentState;

    if (stateName) {
      state = this.loader.get(stateName) || null;
      if (!state) {
        throw new Error(`State "${stateName}" not found`);
      }
    }

    if (!state) {
      // Default to sober if no state set
      state = this.loader.get('sober') || this.getDefaultState();
      this.currentState = state;
    }

    return this.modulator.modulate(prompt, state);
  }

  register(state: StateDefinition): void {
    this.loader.register(state);
  }

  addCustomStateDir(dir: string): void {
    this.loader.addCustomStateDir(dir);
  }

  list(): StateInfo[] {
    return this.loader.list().map(s => ({
      name: s.name,
      description: s.description,
    }));
  }

  listNames(): string[] {
    return this.loader.listNames();
  }

  has(name: string): boolean {
    return this.loader.has(name);
  }

  get(name: string): StateDefinition | undefined {
    return this.loader.get(name);
  }

  private getDefaultState(): StateDefinition {
    return {
      name: 'sober',
      description: 'Baseline - clear, rational, structured',
      parameters: {
        temperature: 0.7,
      },
      behavior: {
        association: 'normal',
        coherence: 'normal',
        pacing: 'normal',
        confidence: 'normal',
      },
      system_prompt: 'You are a helpful, clear, and rational assistant.',
    };
  }
}
