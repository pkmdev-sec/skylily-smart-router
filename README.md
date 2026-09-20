# 🧠 Smart Model Router

[![npm version](https://img.shields.io/npm/v/skylily-smart-router.svg)](https://www.npmjs.com/package/skylily-smart-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-green.svg)](https://nodejs.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen.svg)]()

**Intelligent LLM model router that analyzes task complexity and routes to the optimal model.**

Save 10-100x on costs while maintaining quality. Not every task needs GPT-4 or Claude Opus.

Built by Skylily 🌸

---

## 🎯 The Problem

You're building an AI application. Every API call goes to Claude Opus or GPT-4 because "it just works." But:

- A simple "format this JSON" costs the same as "design a distributed system"
- You're paying $75/1M tokens for tasks that a $0.20/1M model handles perfectly
- Your monthly bill is 100x higher than it needs to be

## 💡 The Solution

Smart Model Router analyzes your task and routes it to the **cheapest model that can handle it**.

```typescript
import { routeTask } from 'skylily-smart-router';

// Simple task → cheap model ($0.20/1M)
const simple = routeTask("Format this JSON: {name: 'John'}");
console.log(simple.model.name);  // "GPT-4.1 Nano"
console.log(simple.estimatedCost.totalCost);  // $0.000001

// Complex task → powerful model ($75/1M)
const complex = routeTask("Design a distributed consensus algorithm for blockchain");
console.log(complex.model.name);  // "Claude Opus 4.5"
console.log(complex.analysis.tier);  // "ultra"
```

**Result:** Same quality, 10-100x lower cost on simple tasks.

---

## 📦 Installation

```bash
npm install skylily-smart-router
```

```bash
yarn add skylily-smart-router
```

```bash
pnpm add skylily-smart-router
```

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { routeTask } from 'skylily-smart-router';

const result = routeTask("Write a hello world function in Python");

console.log(result.model.name);           // "GPT-4.1 Mini"
console.log(result.model.tier);           // "light"
console.log(result.analysis.confidence);  // 0.7
console.log(result.estimatedCost.totalCost);  // $0.000003
console.log(result.reason);               // "Task complexity: light | Selected: GPT-4.1 Mini..."
```

### With Configuration

```typescript
import { SmartRouter } from 'skylily-smart-router';

const router = new SmartRouter({
  preferProvider: 'anthropic',      // Prefer Anthropic models
  maxCostPer1M: 10,                 // Max $10 per 1M output tokens
  requireCapabilities: ['coding'],  // Must have coding capability
});

const result = router.route("Implement OAuth 2.0 authentication");
```

### Just Analyze (No Routing)

```typescript
import { analyzeTask } from 'skylily-smart-router';

const analysis = analyzeTask("Design a microservices architecture");

console.log(analysis.tier);        // "ultra"
console.log(analysis.confidence);  // 0.85
console.log(analysis.signals);     // ["tokens: 10", "ultra: design.*system", ...]
console.log(analysis.suggestedCapabilities);  // ["coding", "reasoning"]
```

---

## 🖥️ CLI Usage

```bash
# Install globally
npm install -g skylily-smart-router

# Route a task
smart-router "your task description"

# Detailed analysis
smart-router --analyze "Build a REST API with authentication"

# List all models
smart-router --list-models

# Filter by tier
smart-router --list-models --tier light

# JSON output (for scripting)
smart-router --json "your task"
```

### CLI Examples

```bash
$ smart-router "format this json"

🧠 Smart Model Router

Task: format this json

Analysis:
  Complexity: LIGHT
  Confidence: 70%

Recommendation:
  ✓ openai/gpt-4.1-nano
    GPT-4.1 Nano
    Cost: $0.05/$0.2 per 1M tokens

Estimated Cost:
  Input:  4 tokens
  Output: 500 tokens (est)
  Total:  $0.000100
```

---

## 📊 Model Tiers

The router classifies tasks into 5 complexity tiers:

| Tier | Cost Range | Use For | Example Models |
|------|-----------|---------|----------------|
| **🔴 Ultra** | $15-75/1M | Deep reasoning, architecture, research | Claude Opus 4.5, o3 |
| **🟠 Heavy** | $2.5-15/1M | Complex coding, analysis, creative writing | Claude Sonnet, Gemini Pro |
| **🟡 Standard** | $0.5-8/1M | Everyday coding, summaries, explanations | GPT-4.1, Gemini Flash |
| **🟢 Light** | $0.15-1.25/1M | Simple coding, formatting, extraction | GPT-4.1 Mini, Claude Haiku |
| **⚪ Nano** | $0.02-0.2/1M | Trivial operations, validation, echoing | GPT-4.1 Nano, Flash Lite |

---

## 🔧 API Reference

### `routeTask(taskText, config?)`

Route a task to the optimal model.

```typescript
import { routeTask, RouterConfig, RoutingResult } from 'skylily-smart-router';

const config: RouterConfig = {
  preferProvider: 'anthropic',      // Optional: prefer this provider
  maxCostPer1M: 10,                 // Optional: max cost per 1M output tokens
  requireCapabilities: ['coding'],  // Optional: required capabilities
  fallbackModel: 'gpt-4.1',        // Optional: fallback if no match
  defaultTier: 'standard',          // Optional: default tier
};

const result: RoutingResult = routeTask("Implement binary search", config);

// RoutingResult structure:
result.model;          // Selected ModelDefinition
result.analysis;       // TaskAnalysis with tier, confidence, signals
result.alternatives;   // Other candidate models
result.estimatedCost;  // { inputTokens, outputTokens, totalCost }
result.reason;         // Human-readable explanation
```

### `analyzeTask(taskText)`

Analyze task complexity without routing.

```typescript
import { analyzeTask, TaskAnalysis } from 'skylily-smart-router';

const analysis: TaskAnalysis = analyzeTask("Design a microservices architecture");

// TaskAnalysis structure:
analysis.tier;                  // "nano" | "light" | "standard" | "heavy" | "ultra"
analysis.confidence;            // 0.0 - 1.0
analysis.signals;               // What triggered this classification
analysis.reasoning;             // Human-readable explanation
analysis.suggestedCapabilities; // ["reasoning", "coding", ...]
```

### `SmartRouter` Class

For persistent configuration and usage tracking.

```typescript
import { SmartRouter, RouterConfig } from 'skylily-smart-router';

const router = new SmartRouter({
  preferProvider: 'anthropic',
  defaultTier: 'standard',
});

// Route tasks
const result = router.route("Fix this bug");

// Estimate cost for specific parameters
const cost = router.estimateCost(result.model, 1000, 500);

// Record usage for analytics
router.recordUsage(result.model.id, "Fix this bug", true, cost.totalCost);

// Get statistics
const stats = router.getStats();
console.log(stats.totalRequests);    // 150
console.log(stats.successRate);      // 0.95
console.log(stats.totalCost);        // 0.0234
console.log(stats.modelBreakdown);   // { "gpt-4.1-mini": { count: 80, ... } }
```

### Model Utilities

```typescript
import {
  MODELS,
  getModelsByTier,
  getModelById,
  getCheapestModel,
  ModelTier,
} from 'skylily-smart-router';

// Get all models in a tier
const lightModels = getModelsByTier('light');

// Find a specific model
const opus = getModelById('claude-opus-4-5');
const opusFull = getModelById('anthropic/claude-opus-4-5');

// Get cheapest model in tier
const cheapNano = getCheapestModel('nano');

// Access all models
console.log(Object.keys(MODELS));
```

---

## 🎯 Complexity Detection

The analyzer looks for patterns to classify tasks:

### Ultra Signals
- "design system", "multi-step reasoning"
- "mathematical proof", "refactor entire"
- "distributed system", "compiler", "interpreter"
- Deep architecture, formal verification

### Heavy Signals
- "implement feature", "build component", "create api"
- "write tests", "debug issue", "review code"
- "analyze code", "explain concept", "write article"

### Standard Signals
- "add function", "update config", "convert format"
- "generate code", "how to", "what is"

### Light Signals
- "format json", "extract from", "parse text"
- "categorize", "classify", "translate phrase"

### Nano Signals
- "yes/no", "capitalize", "validate email"
- "count words", "echo", "trim"

---

## 📈 Cost Savings Examples

| Task | Without Router | With Router | Savings |
|------|---------------|-------------|---------|
| "Format this JSON" | Opus ($0.075) | Nano ($0.0002) | **375x** |
| "Validate email format" | Sonnet ($0.015) | Nano ($0.0002) | **75x** |
| "Write unit test" | Opus ($0.075) | Mini ($0.0006) | **125x** |
| "Design architecture" | Sonnet ($0.015) | Opus ($0.075) | *-5x (correct)* |

The router knows when to upgrade for complex tasks. You save money on simple tasks without sacrificing quality on hard ones.

---

## 🏗️ Supported Models

### Anthropic
| Model | Tier | Output $/1M |
|-------|------|-------------|
| Claude Opus 4.5 | Ultra | $75 |
| Claude Sonnet 4.5 | Heavy | $15 |
| Claude Haiku | Light | $1.25 |

### OpenAI
| Model | Tier | Output $/1M |
|-------|------|-------------|
| o3 | Ultra | $60 |
| GPT-5.2 Codex | Heavy | $15 |
| GPT-4.1 | Standard | $8 |
| GPT-4.1 Mini | Light | $0.60 |
| GPT-4.1 Nano | Nano | $0.20 |

### Google
| Model | Tier | Output $/1M |
|-------|------|-------------|
| Gemini 2.5 Pro | Heavy | $10 |
| Gemini 2.5 Flash | Standard | $1.50 |
| Gemini 2.5 Flash Lite | Nano | $0.08 |

---

## 🛡️ Error Handling

The library provides descriptive error classes:

```typescript
import {
  routeTask,
  SmartRouterError,
  InvalidTaskError,
  NoModelFoundError,
  isSmartRouterError,
  getErrorMessage,
} from 'skylily-smart-router';

try {
  const result = routeTask(userInput);
} catch (error) {
  if (isSmartRouterError(error)) {
    console.log(`[${error.code}] ${error.message}`);
    if (error.suggestion) {
      console.log(`💡 ${error.suggestion}`);
    }
  } else {
    console.log(getErrorMessage(error));
  }
}
```

Error types:
- `InvalidTaskError` - Task text is invalid
- `NoModelFoundError` - No model matches constraints
- `InvalidModelError` - Model ID not found
- `InvalidTierError` - Invalid tier name
- `InvalidConfigError` - Invalid configuration

---

## 📁 Examples

See the [examples](./examples) directory for complete usage examples:

- **[basic-usage.ts](./examples/basic-usage.ts)** - Simple routing examples
- **[with-config.ts](./examples/with-config.ts)** - Advanced configuration
- **[usage-tracking.ts](./examples/usage-tracking.ts)** - Analytics and tracking
- **[batch-routing.ts](./examples/batch-routing.ts)** - Batch processing

Run examples:
```bash
npx tsx examples/basic-usage.ts
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT © [Skylily 🌸](https://github.com/pkmdev-sec)

---

## 🗺️ Roadmap

- [ ] Learning from usage history
- [ ] Custom model definitions
- [ ] Provider-specific routing rules
- [ ] Cost budgets and alerts
- [ ] Streaming support
- [ ] LangChain/LlamaIndex integration

---

## 💬 Support

- 📫 **Issues**: [GitHub Issues](https://github.com/pkmdev-sec/skylily-smart-router/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/pkmdev-sec/skylily-smart-router/discussions)

---

<p align="center">
  Built with 🌸 by Skylily<br>
  <em>Part of the Perpetual Creator Protocol - always building, never stopping.</em>
</p>
