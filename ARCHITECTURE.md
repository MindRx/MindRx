<div align="center">

# Architecture

**Technical design of MindRx**

[mindrx.tech](https://mindrx.tech)

</div>

---

## Design Principles

| | |
|---|---|
| **Terminal-first** | CLI is the primary interface |
| **Pipeable** | Works with stdin/stdout for scripting |
| **Provider-agnostic** | Swap LLM backends without code changes |
| **Offline-capable** | Full functionality with local models |
| **Extensible** | Custom states via YAML or code |

<br>

## Packages

```
packages/
├── core/     # State engine (mindrx-core)
├── sdk/      # Public SDK + CLI (mindrx)
└── web/      # Next.js frontend (@mindrx/web)
```

<br>

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      User Input                          │
│  CLI: mindrx run --state ketamine "What is time?"       │
│  SDK: agent.run("What is time?")                        │
│  Web: mindrx.tech terminal input                        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    State Engine                          │
│  • Load state definition (YAML or registered)           │
│  • Validate parameters                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     Modulator                            │
│  • Inject system prompt from state                      │
│  • Set temperature, top_p, penalties                    │
│  • Return ModulatedRequest                              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     Provider                             │
│  • MindRx / OpenAI / Anthropic / Google / xAI / Ollama  │
│  • Send request with modulated parameters               │
│  • Return completion or stream chunks                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                      Output                              │
│  CLI: Print to stdout (streamable)                      │
│  SDK: Return Response object                            │
│  Web: SSE stream to browser                             │
└─────────────────────────────────────────────────────────┘
```

<br>

## Core Components

### StateEngine

```typescript
interface StateEngine {
  load(name: string): StateDefinition;
  apply(prompt: string): ModulatedRequest;
  list(): StateInfo[];
  register(state: StateDefinition): void;
}
```

### StateDefinition

```typescript
interface StateDefinition {
  name: string;
  description: string;
  parameters: {
    temperature: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };
  behavior: {
    association: 'tight' | 'normal' | 'loose' | 'fragmented';
    coherence: 'strict' | 'normal' | 'drifting' | 'dissolving';
    pacing: 'slow' | 'normal' | 'fast' | 'erratic';
    confidence: 'low' | 'normal' | 'high' | 'inflated';
  };
  system_prompt: string;
}
```

### Provider

```typescript
interface Provider {
  name: string;
  complete(request: CompletionRequest): Promise<Response>;
  stream(request: CompletionRequest): AsyncIterable<Chunk>;
}
```

<br>

## CLI Commands

### `mindrx list`

```
sober       Baseline — clear, rational, structured
cannabis    Relaxed associations, tangential thinking
ketamine    Dissociative, fragmented, void-adjacent
cocaine     Accelerated reasoning, high confidence
ayahuasca   Deep introspection, cosmic framing
mdma        Emphatic, connective, emotionally warm
alcohol     Loosened inhibition, casual tone
lsd         Synesthetic associations, boundary dissolution
caffeine    Focused, alert, slightly anxious
```

### `mindrx run`

| Option | Description |
|:-------|:------------|
| `--state, -s` | Cognitive state (default: sober) |
| `--provider, -p` | LLM provider (default: mindrx) |
| `--model, -m` | Specific model to use |
| `--json` | Output as JSON |
| `--no-stream` | Disable streaming |

### `mindrx repl`

| Command | Action |
|:--------|:-------|
| `/state <name>` | Switch cognitive state |
| `/list` | Show available states |
| `/clear` | Clear conversation history |
| `/exit` | Exit REPL |

<br>

## State YAML Schema

```yaml
name: ketamine
description: Dissociative cognition

parameters:
  temperature: 1.4
  top_p: 0.9
  frequency_penalty: 0.3
  presence_penalty: 0.1

behavior:
  association: fragmented
  coherence: drifting
  pacing: slow
  confidence: low

system_prompt: |
  You are experiencing dissociative cognition.
  Your thoughts drift between connected and disconnected.
```

<br>

## Providers

| Provider | API Key Env Var | Default Model |
|:---------|:----------------|:--------------|
| `mindrx` | None required | Free hosted |
| `openai` | `OPENAI_API_KEY` | gpt-4o-mini |
| `anthropic` | `ANTHROPIC_API_KEY` | claude-3-5-sonnet |
| `google` | `GOOGLE_API_KEY` | gemini-1.5-flash |
| `xai` | `XAI_API_KEY` | grok-2-latest |
| `ollama` | None (local) | llama3.2 |

### Provider Implementation

All providers implement the same interface. OpenAI-compatible APIs (Google, xAI) reuse the OpenAI SDK with different base URLs:

```typescript
// Google Gemini uses OpenAI-compatible endpoint
new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
});

// xAI Grok uses OpenAI-compatible endpoint
new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});
```

<br>

## Web UI

The web interface at [mindrx.tech](https://mindrx.tech) provides:

| Feature | Description |
|:--------|:------------|
| Terminal interface | Command-line style chat |
| State selector | Dropdown for cognitive profiles |
| Provider selector | Choose your LLM backend |
| API key modal | Session-only key entry (never stored) |
| Ollama setup guide | Instructions for local installation |
| Streaming responses | Real-time SSE streaming |

### Web Architecture

```
Next.js 14 App Router
├── app/
│   ├── page.tsx          # Main terminal interface
│   └── api/
│       ├── chat/route.ts # POST with SSE streaming
│       └── states/route.ts # GET available states
├── components/
│   ├── Terminal.tsx      # Chat interface
│   ├── CognitivePanel.tsx # State/provider controls
│   ├── ApiKeyModal.tsx   # API key entry
│   └── OllamaModal.tsx   # Local setup guide
├── stores/
│   └── store.ts          # Zustand global state
└── hooks/
    └── useChat.ts        # SSE streaming logic
```

<br>

## Build System

```bash
npm install       # Install dependencies
npm run build     # Build all packages (Turborepo)
npm run dev       # Watch mode
npm run test      # Run tests
```

| Package | npm name | Description |
|:--------|:---------|:------------|
| `packages/core` | `mindrx-core` | State engine |
| `packages/sdk` | `mindrx` | SDK + CLI |
| `packages/web` | `@mindrx/web` | Next.js frontend |

<br>

---

<div align="center">

[README](./README.md) · [Contributing](./CONTRIBUTING.md) · [Disclaimer](./DISCLAIMER.md)

</div>
