#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline';
import { MindRx } from './mindrx.js';
import type { ProviderName } from './types.js';

const VERSION = '0.1.0';

interface ParsedArgs {
  values: {
    help?: boolean;
    version?: boolean;
    state?: string;
    provider?: string;
    model?: string;
    json?: boolean;
    'no-stream'?: boolean;
  };
  positionals: string[];
}

function printHelp(): void {
  console.log(`
mindrx - Cognitive state simulation for AI agents

USAGE:
  mindrx <command> [options]

COMMANDS:
  list              List available cognitive states
  run <prompt>      Run a prompt with a cognitive state
  repl              Start interactive mode

OPTIONS:
  -s, --state       Cognitive state to apply (default: sober)
  -p, --provider    LLM provider: mindrx, openai, ollama (default: mindrx)
  -m, --model       Specific model to use
  --json            Output as JSON
  --no-stream       Disable streaming output
  -h, --help        Show this help message
  -v, --version     Show version

PROVIDERS:
  mindrx            MindRx hosted backend (free, no API key needed)
  openai            OpenAI API (requires OPENAI_API_KEY)
  ollama            Local Ollama instance

EXAMPLES:
  mindrx list
  mindrx run --state ketamine "What is the nature of time?"
  mindrx run -s cannabis "Write a poem about clouds"
  mindrx run -s cocaine -p openai "Give me a business plan"
  mindrx repl --state ayahuasca

ENVIRONMENT:
  OPENAI_API_KEY    API key for OpenAI provider
  OLLAMA_BASE_URL   Base URL for local Ollama (default: http://localhost:11434)
`);
}

function printVersion(): void {
  console.log(`mindrx v${VERSION}`);
}

async function listStates(): Promise<void> {
  const agent = new MindRx();
  const states = agent.listStates();

  console.log('\nAvailable states:\n');

  for (const name of states) {
    const state = new MindRx({ state: name }).getState();
    const desc = state?.description || '';
    console.log(`  ${name.padEnd(14)} ${desc}`);
  }

  console.log('');
}

async function runPrompt(
  prompt: string,
  options: {
    state: string;
    provider: ProviderName;
    model?: string;
    json: boolean;
    stream: boolean;
  }
): Promise<void> {
  const agent = new MindRx({
    state: options.state,
    provider: options.provider,
    model: options.model,
  });

  if (options.stream && !options.json) {
    for await (const chunk of agent.stream(prompt)) {
      process.stdout.write(chunk.text);
    }
    console.log('');
  } else {
    const response = await agent.run(prompt);

    if (options.json) {
      console.log(JSON.stringify(response, null, 2));
    } else {
      console.log(response.text);
    }
  }
}

async function startRepl(options: {
  state: string;
  provider: ProviderName;
  model?: string;
}): Promise<void> {
  const agent = new MindRx({
    state: options.state,
    provider: options.provider,
    model: options.model,
  });

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`\nmindrx REPL - State: ${options.state} | Provider: ${options.provider}`);
  console.log('Commands: /state <name>, /list, /clear, /exit\n');

  const prompt = (): void => {
    rl.question(`[${agent.getStateName()}] > `, async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      if (trimmed.startsWith('/')) {
        const [cmd, ...args] = trimmed.slice(1).split(' ');

        switch (cmd) {
          case 'state':
            if (args[0]) {
              try {
                agent.setState(args[0]);
                console.log(`Switched to state: ${args[0]}\n`);
              } catch (e) {
                console.log(`Error: ${(e as Error).message}\n`);
              }
            } else {
              console.log(`Current state: ${agent.getStateName()}\n`);
            }
            break;

          case 'list':
            const states = agent.listStates();
            console.log('\nAvailable states:');
            for (const name of states) {
              const marker = name === agent.getStateName() ? ' *' : '';
              console.log(`  ${name}${marker}`);
            }
            console.log('');
            break;

          case 'clear':
            console.clear();
            console.log(`mindrx REPL - State: ${agent.getStateName()}\n`);
            break;

          case 'exit':
          case 'quit':
            rl.close();
            process.exit(0);
            break;

          default:
            console.log(`Unknown command: ${cmd}\n`);
        }

        prompt();
        return;
      }

      try {
        process.stdout.write('\n');
        for await (const chunk of agent.stream(trimmed)) {
          process.stdout.write(chunk.text);
        }
        console.log('\n');
      } catch (e) {
        console.log(`Error: ${(e as Error).message}\n`);
      }

      prompt();
    });
  };

  prompt();
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return '';
  }

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
      state: { type: 'string', short: 's', default: 'sober' },
      provider: { type: 'string', short: 'p', default: 'mindrx' },
      model: { type: 'string', short: 'm' },
      json: { type: 'boolean', default: false },
      'no-stream': { type: 'boolean', default: false },
    },
  }) as ParsedArgs;

  if (values.help) {
    printHelp();
    return;
  }

  if (values.version) {
    printVersion();
    return;
  }

  const command = positionals[0];

  if (!command) {
    printHelp();
    return;
  }

  const state = values.state || 'sober';
  const provider = (values.provider || 'mindrx') as ProviderName;
  const model = values.model;

  switch (command) {
    case 'list':
      await listStates();
      break;

    case 'run': {
      let prompt = positionals.slice(1).join(' ');

      // Read from stdin if no prompt provided
      if (!prompt) {
        prompt = await readStdin();
      }

      if (!prompt) {
        console.error('Error: No prompt provided');
        process.exit(1);
      }

      await runPrompt(prompt, {
        state,
        provider,
        model,
        json: values.json || false,
        stream: !values['no-stream'],
      });
      break;
    }

    case 'repl':
      await startRepl({ state, provider, model });
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
