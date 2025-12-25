import { StateEngine } from 'mindrx-core';
import type { StateDefinition } from 'mindrx-core';
import { createProvider } from './providers/index.js';
import type {
  MindRxOptions,
  Provider,
  ProviderName,
  Response,
  Chunk,
} from './types.js';

export class MindRx {
  private engine: StateEngine;
  private _provider: Provider | null = null;
  private providerName: ProviderName;
  private providerOptions: { apiKey?: string; baseUrl?: string; model?: string };
  private currentStateName: string;
  private model?: string;

  constructor(options: MindRxOptions = {}) {
    this.engine = new StateEngine();

    // Register custom states
    if (options.customStates) {
      for (const state of options.customStates) {
        this.engine.register(state);
      }
    }

    // Store provider config for lazy initialization
    this.providerName = options.provider || 'openai';
    this.providerOptions = {
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      model: options.model,
    };

    this.model = options.model;

    // Set initial state
    this.currentStateName = options.state || 'sober';
    if (this.engine.has(this.currentStateName)) {
      this.engine.load(this.currentStateName);
    }
  }

  private get provider(): Provider {
    if (!this._provider) {
      this._provider = createProvider(this.providerName, this.providerOptions);
    }
    return this._provider;
  }

  async run(prompt: string): Promise<Response> {
    const modulated = this.engine.apply(prompt);

    const response = await this.provider.complete({
      systemPrompt: modulated.systemPrompt,
      userPrompt: modulated.userPrompt,
      parameters: modulated.parameters,
      model: this.model,
    });

    response.state = this.currentStateName;
    return response;
  }

  async *stream(prompt: string): AsyncIterable<Chunk> {
    const modulated = this.engine.apply(prompt);

    yield* this.provider.stream({
      systemPrompt: modulated.systemPrompt,
      userPrompt: modulated.userPrompt,
      parameters: modulated.parameters,
      model: this.model,
    });
  }

  setState(name: string): void {
    this.engine.load(name);
    this.currentStateName = name;
  }

  getState(): StateDefinition | null {
    return this.engine.getCurrent();
  }

  getStateName(): string {
    return this.currentStateName;
  }

  listStates(): string[] {
    return this.engine.listNames();
  }

  hasState(name: string): boolean {
    return this.engine.has(name);
  }

  registerState(state: StateDefinition): void {
    this.engine.register(state);
  }

  addCustomStateDir(dir: string): void {
    this.engine.addCustomStateDir(dir);
  }
}
