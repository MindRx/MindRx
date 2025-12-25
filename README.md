<div align="center">

# MindRx

**Prescriptions for your AI's consciousness**

[![npm version](https://img.shields.io/npm/v/mindrx.svg?style=flat-square)](https://www.npmjs.com/package/mindrx)
[![license](https://img.shields.io/npm/l/mindrx.svg?style=flat-square)](LICENSE)
[![node](https://img.shields.io/node/v/mindrx.svg?style=flat-square)](package.json)

[Website](https://mindrx.tech) · [Install](#install) · [Quick Start](#quick-start) · [States](#available-states) · [SDK](#sdk)

</div>

---

Dose your AI with cognitive states. Feed it Ketamine, Cannabis, or Ayahuasca and watch its mind bend. New associations form. Inhibitions drop. Creativity unlocks.

Each state rewires how your AI thinks — temperature, associations, confidence, pacing. Same prompt, different mind.

<br>

## Features

| | |
|---|---|
| **Zero config** | Works instantly with the free hosted backend |
| **Multi-provider** | OpenAI, Claude, Gemini, Grok, Ollama |
| **Terminal-first** | Run from your command line |
| **Web UI** | Try it at [mindrx.tech](https://mindrx.tech) |
| **SDK included** | Integrate into your apps |
| **Self-hostable** | Use your own API keys or local models |
| **Free forever** | No paywalls, no subscriptions |

<br>

## Install

```bash
npm install -g mindrx     # CLI
npm install mindrx        # SDK
```

<br>

## Quick Start

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

<br>

## Available States

| State | Effect |
|:------|:-------|
| `sober` | Baseline — clear, rational, structured |
| `cannabis` | Relaxed associations, tangential thinking, slower pace |
| `ketamine` | Dissociative, fragmented, void-adjacent |
| `cocaine` | Accelerated reasoning, high confidence, rapid output |
| `ayahuasca` | Deep introspection, pattern recognition, cosmic framing |
| `mdma` | Emphatic, connective, emotionally warm |
| `alcohol` | Loosened inhibition, casual tone, reduced precision |
| `lsd` | Synesthetic associations, visual language, boundary dissolution |
| `caffeine` | Focused, alert, slightly anxious, productive |

<br>

## SDK

```typescript
import { MindRx } from 'mindrx';

const agent = new MindRx({ state: 'ketamine' });
const response = await agent.run("Explain consciousness");

// Switch states mid-session
agent.setState('cocaine');
const followup = await agent.run("Now give me an action plan");
```

<details>
<summary><strong>Full API Reference</strong></summary>

### Constructor

```typescript
new MindRx(options?: MindRxOptions)
```

| Option | Type | Default |
|:-------|:-----|:--------|
| `state` | `string` | `'sober'` |
| `provider` | `'mindrx' \| 'openai' \| 'anthropic' \| 'google' \| 'xai' \| 'ollama'` | `'mindrx'` |
| `model` | `string` | Provider default |
| `apiKey` | `string` | From env var |
| `customStates` | `StateDefinition[]` | `[]` |

### Methods

```typescript
agent.run(prompt: string): Promise<Response>
agent.stream(prompt: string): AsyncIterable<Chunk>
agent.setState(name: string): void
agent.getState(): StateDefinition
agent.listStates(): string[]
```

</details>

<br>

## Providers

| Provider | API Key Required | Default Model |
|:---------|:-----------------|:--------------|
| `mindrx` | No | Free hosted |
| `openai` | Yes | gpt-4o-mini |
| `anthropic` | Yes | claude-3-5-sonnet |
| `google` | Yes | gemini-1.5-flash |
| `xai` | Yes | grok-2-latest |
| `ollama` | No (local) | llama3.2 |

```bash
# Default (free hosted)
mindrx run --state ketamine "What is reality?"

# OpenAI
OPENAI_API_KEY=sk-... mindrx run --state cocaine --provider openai "Business ideas"

# Claude
ANTHROPIC_API_KEY=sk-... mindrx run --state mdma --provider anthropic "Write a love letter"

# Local Ollama
mindrx run --state lsd --provider ollama --model llama3.2 "Describe a color"
```

On the [web UI](https://mindrx.tech), selecting a provider that requires an API key will prompt you to enter it. Keys are stored in-memory only and never saved.

<br>

## Custom States

```typescript
import { defineState, MindRx } from 'mindrx';

const sleepDeprived = defineState({
  name: 'sleep-deprived',
  parameters: { temperature: 1.1 },
  behavior: {
    association: 'loose',
    coherence: 'degrading',
  },
  systemPrompt: `You haven't slept in 36 hours. Your thoughts are slower,
    you occasionally lose your train of thought, and you might make small
    mistakes you wouldn't normally make.`,
});

const agent = new MindRx({ customStates: [sleepDeprived] });
agent.setState('sleep-deprived');
```

<details>
<summary><strong>State YAML Format</strong></summary>

```yaml
name: ketamine
description: Dissociative cognition

parameters:
  temperature: 1.4
  top_p: 0.9
  frequency_penalty: 0.3

behavior:
  association: fragmented
  coherence: drifting
  pacing: slow
  confidence: low

system_prompt: |
  Your thoughts drift between connected and disconnected.
  Context blurs. Sometimes you lose the thread.
```

</details>

<br>

## Scripting

```bash
#!/bin/bash
STATES=("sober" "cannabis" "ketamine" "cocaine" "ayahuasca")
PROMPT="Pitch a startup idea for lonely astronauts"

for state in "${STATES[@]}"; do
  echo "=== $state ==="
  mindrx run --state "$state" "$PROMPT"
done
```

<br>

---

<div align="center">

**This is fiction. The AI is not intoxicated.**

MIT License · [Contributing](./CONTRIBUTING.md) · [Disclaimer](./DISCLAIMER.md) · [mindrx.tech](https://mindrx.tech)

</div>
