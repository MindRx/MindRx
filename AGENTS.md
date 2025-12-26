# AGENTS.md

This file provides guidance to agentic coding agents working in the MindRx repository.

## Build Commands

### Root Level (Monorepo)
```bash
npm install              # Install all dependencies
npm run build            # Build all packages (core → sdk → web)
npm run dev              # Watch mode for all packages
npm run test             # Run tests (requires build first)
npm run lint             # Run linting across all packages
npm run clean            # Clean all build artifacts
```

### Package-Specific Commands
```bash
# Core package
cd packages/core && npm run build
cd packages/core && npm run dev
cd packages/core && npm run test
cd packages/core && npm run clean

# SDK package  
cd packages/sdk && npm run build
cd packages/sdk && npm run dev
cd packages/sdk && npm run test
cd packages/sdk && npm run clean

# Web package
cd apps/web && npm run dev      # Dev server on http://0.0.0.0:3000
cd apps/web && npm run build    # Production build
cd apps/web && npm run start    # Start production server
cd apps/web && npm run clean
```

### CLI Usage
```bash
node packages/sdk/dist/cli.js list                     # List available states
node packages/sdk/dist/cli.js run "prompt"             # Run prompt
node packages/sdk/dist/cli.js run -s ketamine "prompt" # With specific state
node packages/sdk/dist/cli.js repl                     # Interactive mode
```

### Testing
- Tests use Node.js native test runner (`node --test`)
- Tests require build first: `npm run build && npm run test`
- No test framework dependencies - use native Node.js assertions
- Test files should be named `*.test.js` in respective package directories

## Code Style Guidelines

### Module System & Imports
- **ESM only**: All packages use `"type": "module"`
- **File extensions**: Always include `.js` extensions in imports (TypeScript compiles to ESM)
- **Import style**: 
  ```typescript
  // Default imports for classes
  import { StateEngine } from './engine.js';
  
  // Type-only imports for types
  import type { StateDefinition } from './types.js';
  
  // Named imports for utilities
  import { createProvider } from './providers/index.js';
  ```

### TypeScript Configuration
- **Strict mode**: Enabled across all packages
- **Target**: ES2022 for packages, ES2017 for web (Next.js)
- **Module resolution**: NodeNext for packages, bundler for web
- **Always declare types**: Use interfaces for all public APIs

### Naming Conventions
- **Classes**: PascalCase (`StateEngine`, `OpenAIProvider`)
- **Interfaces**: PascalCase with descriptive names (`StateDefinition`, `CompletionRequest`)
- **Functions/Methods**: camelCase (`load()`, `apply()`, `createProvider()`)
- **Variables**: camelCase (`currentState`, `providerName`)
- **Constants**: UPPER_SNAKE_CASE for enum values and constants
- **Files**: kebab-case for components (`terminal-input.tsx`), camelCase for utilities (`stateEngine.ts`)

### Error Handling
- **Throw descriptive errors**: Include context and available options
  ```typescript
  if (!state) {
    throw new Error(`State "${name}" not found. Available: ${this.loader.listNames().join(', ')}`);
  }
  ```
- **Fail fast**: Validate inputs early in methods
- **No silent failures**: Always throw or handle errors explicitly
- **Provider errors**: Let provider errors bubble up, wrap with context if needed

### Code Organization
- **Single responsibility**: Each class/module has one clear purpose
- **Dependency injection**: Pass dependencies via constructor options
- **Lazy initialization**: Initialize providers only when needed
- **Private methods**: Use `#` prefix for truly private methods, `private` for internal class methods

### Interface Design
- **Option objects**: Use option objects for constructors with many parameters
- **Required vs optional**: Make truly required fields non-optional
- **Return types**: Always specify return types for public methods
- **Generic types**: Use generics where appropriate, keep them simple

### React/Next.js Specific
- **Components**: Functional components with hooks
- **'use client'**: Required for client-side components
- **Styling**: Tailwind CSS classes only, no inline styles
- **State management**: Zustand for global state, local useState for component state
- **File structure**: Group components together, hooks in separate folder

### Provider Pattern
- **Interface compliance**: All providers implement `Provider` interface
- **Consistent API**: Same method signatures across providers
- **Default models**: Each provider should have a sensible default model
- **Environment variables**: Use environment variables for API keys, fallback to options

### YAML State Files
- **Structure**: Follow existing state definition schema
- **Naming**: kebab-case filenames (`ketamine.yaml`, `lsd.yaml`)
- **Content**: Descriptive names, clear system prompts, balanced parameters

### Build & Dependencies
- **Build order**: core → sdk → web (enforced by Turbo)
- **Internal dependencies**: Use workspace references (`"mindrx-core": "^0.1.1"`)
- **Peer dependencies**: Minimize external dependencies in core packages
- **Dev dependencies**: Keep TypeScript and build tools in devDependencies

### Git & Commits
- **Conventional commits**: Use clear, descriptive commit messages
- **Atomic changes**: One logical change per commit
- **Branch structure**: Feature branches for development, main for releases

### Performance Considerations
- **Async/await**: Use for all I/O operations
- **Streaming**: Implement streaming for LLM responses where possible
- **Memory**: Be mindful of memory usage in long-running processes
- **Caching**: Cache loaded states and provider instances

### Security
- **API keys**: Never commit API keys, use environment variables
- **Input validation**: Validate user inputs in API routes
- **No eval**: Never use eval() or similar dynamic code execution
- **Sanitization**: Sanitize user inputs in web interface

## Environment Setup
- **Node version**: >=18 (specified in package.json engines)
- **Package manager**: npm (specified in packageManager)
- **Environment variables**: See CLAUDE.md for required variables

## Testing Strategy
- **Unit tests**: Focus on core logic and state transformations
- **Integration tests**: Test provider integrations with mock APIs
- **No UI tests**: Web UI testing not currently implemented
- **Native test runner**: Use Node.js built-in test runner