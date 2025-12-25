# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Build Commands

```bash
npm install          # Install all dependencies
npm run build        # Build all packages (Turborepo)
npm run dev          # Watch mode for all packages
npm run test         # Run tests (requires build first)
npm run clean        # Clean all build artifacts
```

### Package-specific

```bash
cd packages/core && npm run build    # Core package
cd packages/sdk && npm run build     # SDK package
cd packages/web && npm run dev       # Web dev server (http://0.0.0.0:3000)
cd packages/web && npm run build     # Web production build
```

### CLI

```bash
node packages/sdk/dist/cli.js list                     # List states
node packages/sdk/dist/cli.js run "prompt"             # Run prompt
node packages/sdk/dist/cli.js run -s ketamine "prompt" # With state
node packages/sdk/dist/cli.js repl                     # Interactive mode
```

---

## Architecture

Turborepo monorepo with three packages. Build order: `core` → `sdk` → `web`

### `mindrx-core`

State engine that transforms prompts based on cognitive state definitions.

| File | Purpose |
|:-----|:--------|
| `src/engine.ts` | StateEngine orchestrates loader and modulator |
| `src/loader.ts` | Loads YAML state definitions from `states/` |
| `src/modulator.ts` | Builds system prompts + behavioral guidance |
| `src/types.ts` | Core TypeScript interfaces |

### `mindrx` SDK

Public API and CLI.

| File | Purpose |
|:-----|:--------|
| `src/mindrx.ts` | MindRx class with `run()`, `stream()`, `setState()` |
| `src/providers/` | LLM adapters (openai, anthropic, google, xai, ollama, mindrx) |
| `src/cli.ts` | CLI commands: `list`, `run`, `repl` |

### `@mindrx/web`

Next.js 14 terminal-style web UI at [mindrx.tech](https://mindrx.tech).

| File | Purpose |
|:-----|:--------|
| `app/api/states/route.ts` | GET available states |
| `app/api/chat/route.ts` | POST with SSE streaming |
| `stores/store.ts` | Zustand global state (includes apiKeys, modals) |
| `hooks/useChat.ts` | SSE streaming logic, passes apiKey to backend |
| `components/ApiKeyModal.tsx` | Session-only API key entry |
| `components/OllamaModal.tsx` | Local Ollama setup instructions |

---

## State Definitions

YAML files in `packages/core/states/` (9 built-in):

```yaml
name: string
description: string
parameters:
  temperature: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
behavior:
  association: tight | normal | loose | fragmented
  coherence: strict | normal | drifting | dissolving
  pacing: slow | normal | fast | erratic
  confidence: low | normal | high | inflated
system_prompt: string
```

---

## Providers

| Provider | API Key Env Var | Default Model |
|:---------|:----------------|:--------------|
| `mindrx` | None | Free hosted backend |
| `openai` | `OPENAI_API_KEY` | gpt-4o-mini |
| `anthropic` | `ANTHROPIC_API_KEY` | claude-3-5-sonnet |
| `google` | `GOOGLE_API_KEY` | gemini-1.5-flash |
| `xai` | `XAI_API_KEY` | grok-2-latest |
| `ollama` | None (local) | llama3.2 |

Provider files in `packages/sdk/src/providers/`:
- `openai.ts` - Uses OpenAI SDK
- `anthropic.ts` - Uses Anthropic SDK
- `google.ts` - Uses OpenAI SDK with Gemini-compatible endpoint
- `xai.ts` - Uses OpenAI SDK with xAI endpoint
- `ollama.ts` - Direct HTTP to local Ollama
- `mindrx.ts` - Hosted backend at pharmaicy.store

---

## Key Patterns

| Pattern | Details |
|:--------|:--------|
| ESM modules | `.js` extensions required in imports |
| Types | Defined in `types.ts` of each package |
| Provider interface | `complete()` and `stream()` methods |
| `defineState()` | Converts simple input to full StateDefinition |
| Intensity slider | Linear interpolation between baseline and full profile |
| Session-only API keys | Web UI stores keys in Zustand, never persisted |

---

## Environment Variables

```bash
OPENAI_API_KEY=       # For openai provider
ANTHROPIC_API_KEY=    # For anthropic provider
GOOGLE_API_KEY=       # For google provider
XAI_API_KEY=          # For xai provider
OLLAMA_BASE_URL=      # Optional, defaults to http://localhost:11434
```

Default provider is `mindrx` (hosted backend, no API key needed).

---

## Web UI API Key Flow

When a user selects a provider that requires an API key:

1. `ModelSelector.tsx` checks if key exists in `store.apiKeys`
2. If not, shows `ApiKeyModal.tsx` for session-only key entry
3. Key is stored in Zustand state (memory only)
4. `useChat.ts` includes key in POST to `/api/chat`
5. `route.ts` passes key to MindRx SDK constructor
6. Provider uses key for API calls

For Ollama:
1. `ModelSelector.tsx` detects Ollama selection
2. Shows `OllamaModal.tsx` with installation instructions
3. User confirms they have Ollama installed
4. Provider connects to `localhost:11434`
