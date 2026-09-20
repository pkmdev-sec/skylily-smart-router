#!/usr/bin/env node
/**
 * Smart Model Router CLI
 * Skylily 🌸
 */

import { routeTask, analyzeTask, MODELS, getModelsByTier, ModelTier } from './index.js';
import { getPricingSummary } from './models.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const VERSION = pkg.version;

// ANSI colors
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Handle --version first
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(`smart-router v${VERSION}`);
  process.exit(0);
}

function printUsage(): void {
  console.log(`
${c.bright}${c.magenta}🧠 Smart Model Router${c.reset}
${c.dim}Auto-route tasks to optimal LLM models${c.reset}

${c.cyan}Usage:${c.reset}
  smart-router "your task description"
  smart-router --analyze "your task description"
  smart-router --list-models
  smart-router --list-models --tier <tier>
  smart-router --json "your task description"
  smart-router --help

${c.cyan}Options:${c.reset}
  --analyze, -a     Show detailed analysis
  --list-models, -l List all models
  --tier <tier>     Filter by tier (nano, light, standard, heavy, ultra)
  --json, -j        Output as JSON
  --version, -v     Show version
  --help, -h        Show this help

${c.cyan}Examples:${c.reset}
  smart-router "Write a hello world in Python"
  smart-router "Design a distributed consensus algorithm"
  smart-router --analyze "Build a REST API with auth"
  smart-router --list-models --tier light
`);
}

// Parse args
const args = process.argv.slice(2);

// Handle --pricing
if (args.includes("--pricing")) {
  console.log(getPricingSummary());
  process.exit(0);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(0);
}

// List models
if (args.includes('--list-models') || args.includes('-l')) {
  const tierIndex = args.findIndex(a => a === '--tier');
  const tier = tierIndex !== -1 ? args[tierIndex + 1] as ModelTier : undefined;
  
  const models = tier ? getModelsByTier(tier) : Object.values(MODELS);
  
  console.log(`\n${c.bright}${c.magenta}Available Models${tier ? ` (${tier})` : ''}${c.reset}\n`);
  
  for (const model of models) {
    console.log(`${c.green}${model.provider}/${model.id}${c.reset}`);
    console.log(`  ${c.dim}${model.name} | Tier: ${model.tier} | Context: ${model.contextWindow}${c.reset}`);
    console.log(`  ${c.dim}Cost: $${model.cost.inputPer1M}/${model.cost.outputPer1M} per 1M tokens${c.reset}`);
    console.log('');
  }
  process.exit(0);
}

// Get task text (everything that's not a flag)
const task = args.filter(a => !a.startsWith('-')).join(' ');

if (!task) {
  console.error(`${c.red}Error: No task provided${c.reset}`);
  printUsage();
  process.exit(1);
}

// Route the task
const result = routeTask(task);

// JSON output
if (args.includes('--json') || args.includes('-j')) {
  console.log(JSON.stringify({
    task,
    recommendation: {
      model: `${result.model.provider}/${result.model.id}`,
      provider: result.model.provider,
      tier: result.analysis.tier,
    },
    analysis: result.analysis,
    alternatives: result.alternatives.map(m => `${m.provider}/${m.id}`),
    estimatedCost: result.estimatedCost,
  }, null, 2));
  process.exit(0);
}

// Standard output
const tierColors: Record<string, string> = {
  nano: c.green,
  light: c.cyan,
  standard: c.yellow,
  heavy: c.magenta,
  ultra: c.red,
};

console.log(`\n${c.bright}${c.magenta}🧠 Smart Model Router${c.reset}\n`);
console.log(`${c.cyan}Task:${c.reset} ${task.slice(0, 80)}${task.length > 80 ? '...' : ''}\n`);

console.log(`${c.bright}Analysis:${c.reset}`);
console.log(`  Complexity: ${tierColors[result.analysis.tier]}${result.analysis.tier.toUpperCase()}${c.reset}`);
console.log(`  Confidence: ${Math.round(result.analysis.confidence * 100)}%\n`);

console.log(`${c.bright}Recommendation:${c.reset}`);
console.log(`  ${c.green}✓${c.reset} ${c.bright}${result.model.provider}/${result.model.id}${c.reset}`);
console.log(`    ${result.model.name}`);
console.log(`    ${c.dim}Cost: $${result.model.cost.inputPer1M}/${result.model.cost.outputPer1M} per 1M tokens${c.reset}\n`);

console.log(`${c.bright}Estimated Cost:${c.reset}`);
console.log(`  Input:  ${result.estimatedCost.inputTokens} tokens`);
console.log(`  Output: ${result.estimatedCost.outputTokens} tokens (est)`);
console.log(`  Total:  ${c.green}$${result.estimatedCost.totalCost.toFixed(6)}${c.reset}\n`);

if (result.alternatives.length > 0) {
  console.log(`${c.bright}Alternatives:${c.reset}`);
  for (const alt of result.alternatives.slice(0, 3)) {
    console.log(`  • ${alt.provider}/${alt.id} - $${alt.cost.outputPer1M}/1M out`);
  }
  console.log('');
}

// Detailed analysis if requested
if (args.includes('--analyze') || args.includes('-a')) {
  console.log(`${c.bright}Signals:${c.reset}`);
  for (const signal of result.analysis.signals) {
    console.log(`  - ${signal}`);
  }
  console.log('');
}

console.log(`${c.dim}Task complexity: ${result.analysis.tier} | Selected: ${result.model.name} (${result.model.provider}) | Cost: $${result.model.cost.outputPer1M}/1M output tokens | Strengths: ${result.model.strengths?.slice(0, 2).join(', ') || 'general'}${c.reset}`);
