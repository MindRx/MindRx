import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import type { StateDefinition } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILT_IN_STATES_DIR = join(__dirname, '..', 'states');

export class StateLoader {
  private states: Map<string, StateDefinition> = new Map();
  private customStateDirs: string[] = [];

  constructor() {
    this.loadBuiltInStates();
  }

  private loadBuiltInStates(): void {
    if (!existsSync(BUILT_IN_STATES_DIR)) {
      return;
    }

    const files = readdirSync(BUILT_IN_STATES_DIR).filter(f => f.endsWith('.yaml'));

    for (const file of files) {
      const filePath = join(BUILT_IN_STATES_DIR, file);
      const state = this.loadStateFile(filePath);
      if (state) {
        this.states.set(state.name, state);
      }
    }
  }

  private loadStateFile(filePath: string): StateDefinition | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const parsed = parseYaml(content) as StateDefinition;
      return this.validateState(parsed);
    } catch (error) {
      console.error(`Failed to load state from ${filePath}:`, error);
      return null;
    }
  }

  private validateState(state: unknown): StateDefinition | null {
    if (!state || typeof state !== 'object') {
      return null;
    }

    const s = state as Record<string, unknown>;

    if (typeof s.name !== 'string' || !s.name) {
      return null;
    }

    // Provide defaults for optional fields
    const validated: StateDefinition = {
      name: s.name,
      description: typeof s.description === 'string' ? s.description : '',
      parameters: {
        temperature: 0.7,
        ...(s.parameters as object || {}),
      },
      behavior: {
        association: 'normal',
        coherence: 'normal',
        pacing: 'normal',
        confidence: 'normal',
        ...(s.behavior as object || {}),
      },
      system_prompt: typeof s.system_prompt === 'string' ? s.system_prompt : '',
    };

    return validated;
  }

  addCustomStateDir(dir: string): void {
    if (!existsSync(dir)) {
      return;
    }

    this.customStateDirs.push(dir);
    const files = readdirSync(dir).filter(f => f.endsWith('.yaml'));

    for (const file of files) {
      const filePath = join(dir, file);
      const state = this.loadStateFile(filePath);
      if (state) {
        this.states.set(state.name, state);
      }
    }
  }

  register(state: StateDefinition): void {
    const validated = this.validateState(state);
    if (validated) {
      this.states.set(validated.name, validated);
    }
  }

  get(name: string): StateDefinition | undefined {
    return this.states.get(name);
  }

  has(name: string): boolean {
    return this.states.has(name);
  }

  list(): StateDefinition[] {
    return Array.from(this.states.values());
  }

  listNames(): string[] {
    return Array.from(this.states.keys());
  }
}
