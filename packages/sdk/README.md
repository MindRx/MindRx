<div align="center">

# MindRx

**Cognitive state simulation for AI agents**

[![npm version](https://img.shields.io/npm/v/mindrx.svg?style=flat-square)](https://www.npmjs.com/package/mindrx)
[![license](https://img.shields.io/npm/l/mindrx.svg?style=flat-square)](LICENSE)
[![node](https://img.shields.io/node/v/mindrx.svg?style=flat-square)](package.json)

[Website](https://mindrx.tech) · [GitHub](https://github.com/MindRx/MindRx)

</div>

---

Run AI agents in altered cognitive states. Select a profile, and the agent's reasoning, tone, and associations shift accordingly.

<br>

## Install

```bash
npm install -g mindrx     # CLI
npm install mindrx        # SDK
```

<br>

## Quick Start

### CLI

```bash
# List available states
mindrx list

# Run with a cognitive state
mindrx run --state ketamine "What is the nature of time?"

# Pipe input
echo "Write me a poem about entropy" | mindrx run --state cannabis

# Interactive mode
mindrx repl --state ayahuasca
```

### SDK

```typescript
import { MindRx } from 'mindrx';

const agent = new MindRx({ state: 'ketamine' });
const response = await agent.run("Explain consciousness");
console.log(response.content);

// Streaming
for await (const chunk of agent.stream("Tell me a story")) {
  process.stdout.write(chunk.content);
}
```

<br>

## Available States

| State | Effect |
|:------|:-------|
| `sober` | Baseline — clear, rational, structured |
| `cannabis` | Relaxed associations, tangential thinking |
| `ketamine` | Dissociative, fragmented, void-adjacent |
| `cocaine` | Accelerated reasoning, high confidence |
| `ayahuasca` | Deep introspection, cosmic framing |
| `mdma` | Emphatic, connective, emotionally warm |
| `alcohol` | Loosened inhibition, casual tone |
| `lsd` | Synesthetic associations, boundary dissolution |
| `caffeine` | Focused, alert, slightly anxious |

<br>

## Providers

| Provider | Setup | Default Model |
|:---------|:------|:--------------|
| `mindrx` | None | Free hosted |
| `openai` | `OPENAI_API_KEY` | gpt-4o-mini |
| `anthropic` | `ANTHROPIC_API_KEY` | claude-3-5-sonnet |
| `google` | `GOOGLE_API_KEY` | gemini-1.5-flash |
| `xai` | `XAI_API_KEY` | grok-2-latest |
| `ollama` | Local install | llama3.2 |

```typescript
// Default (free hosted)
const agent = new MindRx({ state: 'ketamine' });

// OpenAI
const agent = new MindRx({
  state: 'cocaine',
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

// Local Ollama
const agent = new MindRx({
  state: 'lsd',
  provider: 'ollama',
  model: 'llama3.2'
});
```

<br>

## API Reference

### Constructor

```typescript
new MindRx(options?: MindRxOptions)
```

| Option | Type | Default |
|:-------|:-----|:--------|
| `state` | `string` | `'sober'` |
| `provider` | `ProviderName` | `'mindrx'` |
| `model` | `string` | Provider default |
| `apiKey` | `string` | Environment variable |
| `customStates` | `StateDefinition[]` | `[]` |

### Methods

```typescript
// Run a single prompt
agent.run(prompt: string): Promise<Response>

// Stream response chunks
agent.stream(prompt: string): AsyncIterable<Chunk>

// Change state
agent.setState(name: string): void

// Get current state
agent.getState(): StateDefinition

// List available states
agent.listStates(): string[]
```

### Types

```typescript
interface Response {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface Chunk {
  content: string;
  done: boolean;
}
```

<br>

## Custom States

```typescript
import { defineState, MindRx } from 'mindrx';

const sleepDeprived = defineState({
  name: 'sleep-deprived',
  description: '36 hours without sleep',
  parameters: {
    temperature: 1.1,
    top_p: 0.95
  },
  behavior: {
    association: 'loose',
    coherence: 'drifting',
    pacing: 'slow',
    confidence: 'low'
  },
  systemPrompt: `You haven't slept in 36 hours. Your thoughts are slower,
    you occasionally lose your train of thought, and you might make small
    mistakes you wouldn't normally make.`
});

const agent = new MindRx({ customStates: [sleepDeprived] });
agent.setState('sleep-deprived');
```

<br>

## CLI Commands

### `mindrx list`

List all available cognitive states.

### `mindrx run`

| Option | Description |
|:-------|:------------|
| `--state, -s` | Cognitive state (default: sober) |
| `--provider, -p` | LLM provider (default: mindrx) |
| `--model, -m` | Specific model |
| `--json` | Output as JSON |
| `--no-stream` | Disable streaming |

### `mindrx repl`

| Command | Action |
|:--------|:-------|
| `/state <name>` | Switch cognitive state |
| `/list` | Show available states |
| `/clear` | Clear conversation |
| `/exit` | Exit REPL |

<br>

---

<div align="center">

MIT License

**This is fiction. The AI is not intoxicated.**

</div>
