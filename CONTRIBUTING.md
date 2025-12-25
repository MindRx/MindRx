<div align="center">

# Contributing

**Help build MindRx**

[mindrx.tech](https://mindrx.tech) · [GitHub](https://github.com/MindRx/MindRx)

</div>

---

## Quick Start

```bash
git clone https://github.com/MindRx/MindRx.git
cd MindRx
npm install
npm run build
npm run dev
```

<br>

## Project Structure

```
packages/
├── core/     # State engine, loader, modulator (mindrx-core)
├── sdk/      # MindRx class, providers, CLI (mindrx)
└── web/      # Next.js frontend (@mindrx/web)
```

<br>

## Adding a State

Create a YAML file in `packages/core/states/`:

```yaml
name: yourstate
description: Brief description

parameters:
  temperature: 1.0
  top_p: 0.9

behavior:
  association: normal
  coherence: normal
  pacing: normal
  confidence: normal

system_prompt: |
  Your system prompt here...
```

Then rebuild:

```bash
npm run build
```

<br>

## Adding a Provider

| Step | Action |
|:-----|:-------|
| 1 | Create `packages/sdk/src/providers/yourprovider.ts` |
| 2 | Implement the `Provider` interface |
| 3 | Add to `packages/sdk/src/providers/index.ts` |
| 4 | Add provider name to `ProviderName` type in `types.ts` |

Existing providers to reference:
- `openai.ts` - Standard OpenAI SDK usage
- `anthropic.ts` - Anthropic SDK usage
- `google.ts` - OpenAI SDK with custom baseURL
- `xai.ts` - OpenAI SDK with custom baseURL
- `ollama.ts` - Direct HTTP requests

<br>

## Pull Requests

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Make changes
# 4. Test
npm run build && npm test

# 5. Submit PR
```

<br>

## Code Style

| Rule | |
|:-----|:--|
| TypeScript strict mode | Required |
| No `any` types | Required |
| Meaningful variable names | Required |
| Small functions | Preferred |
| ESM imports with `.js` extension | Required |

<br>

## Web UI Development

```bash
cd packages/web
npm run dev
```

Key components:
- `components/Terminal.tsx` - Chat interface
- `components/CognitivePanel.tsx` - State/provider controls
- `components/ApiKeyModal.tsx` - API key entry modal
- `components/OllamaModal.tsx` - Local setup instructions
- `stores/store.ts` - Zustand state management
- `hooks/useChat.ts` - SSE streaming

<br>

---

<div align="center">

Questions? [Open an issue](https://github.com/MindRx/MindRx/issues)

</div>
