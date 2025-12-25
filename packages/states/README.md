# @mindrx/states

Canonical cognitive state profiles for MindRx.

## Profiles

| State | Temperature | Association | Coherence |
|:------|:------------|:------------|:----------|
| sober | 0.7 | normal | strict |
| cannabis | 1.1 | loose | drifting |
| ketamine | 1.4 | fragmented | dissolving |
| cocaine | 0.9 | tight | strict |
| ayahuasca | 1.3 | loose | drifting |
| mdma | 1.0 | normal | normal |
| alcohol | 1.2 | loose | drifting |
| lsd | 1.5 | fragmented | dissolving |
| caffeine | 0.8 | tight | strict |

## Schema

Each profile is a YAML file with the following structure:

```yaml
name: ketamine
description: Dissociative, fragmented, void-adjacent

parameters:
  temperature: 1.4
  top_p: 0.9
  frequency_penalty: 0.3
  presence_penalty: 0.2

behavior:
  association: fragmented
  coherence: dissolving
  pacing: slow
  confidence: low

system_prompt: |
  Your cognitive instructions here...
```

## Behavior Descriptors

### Association
- `tight` — Ideas closely connected
- `normal` — Standard associations
- `loose` — Tangential connections
- `fragmented` — Disconnected thoughts

### Coherence
- `strict` — Highly logical
- `normal` — Standard reasoning
- `drifting` — Occasional tangents
- `dissolving` — Loose logic

### Pacing
- `slow` — Deliberate, measured
- `normal` — Standard rhythm
- `fast` — Rapid, energetic
- `erratic` — Unpredictable tempo

### Confidence
- `low` — Uncertain, hedging
- `normal` — Standard certainty
- `high` — Assured
- `inflated` — Overconfident

## Usage

```javascript
import { STATES, BEHAVIORS } from '@mindrx/states';

console.log(STATES);
// ['sober', 'cannabis', 'ketamine', ...]
```

Or import profiles directly:

```javascript
import { readFileSync } from 'fs';
import { parse } from 'yaml';

const ketamine = parse(readFileSync(
  'node_modules/@mindrx/states/profiles/ketamine.yaml',
  'utf8'
));
```
