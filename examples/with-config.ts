/**
 * Advanced Configuration Example
 * Smart Model Router - Skylily 🌸
 * 
 * Run: npx ts-node examples/with-config.ts
 * Or: npx tsx examples/with-config.ts
 */

import { SmartRouter, routeTask, RouterConfig } from '../src/index.js';

// Example 1: Provider preference
console.log('=== Example 1: Provider Preference ===\n');

const anthropicRouter = new SmartRouter({
  preferProvider: 'anthropic',
});

const task = 'Implement a REST API with authentication';
const result = anthropicRouter.route(task);

console.log(`Task: ${task}`);
console.log(`Provider: ${result.model.provider}`);
console.log(`Model: ${result.model.name}`);
console.log();

// Example 2: Cost limit
console.log('=== Example 2: Cost Limit ===\n');

const budgetRouter = new SmartRouter({
  maxCostPer1M: 2, // Max $2 per 1M output tokens
});

const expensiveTask = 'Design a complex distributed system';
const budgetResult = budgetRouter.route(expensiveTask);

console.log(`Task: ${expensiveTask}`);
console.log(`Model: ${budgetResult.model.name}`);
console.log(`Cost: $${budgetResult.model.cost.outputPer1M}/1M tokens`);
console.log(`Note: Would normally use ultra tier, but limited by budget`);
console.log();

// Example 3: Capability requirements
console.log('=== Example 3: Capability Requirements ===\n');

const codingRouter = new SmartRouter({
  requireCapabilities: ['coding', 'reasoning'],
});

const codeTask = 'Review this code for security vulnerabilities';
const codeResult = codingRouter.route(codeTask);

console.log(`Task: ${codeTask}`);
console.log(`Model: ${codeResult.model.name}`);
console.log(`Capabilities: ${codeResult.model.capabilities.join(', ')}`);
console.log();

// Example 4: Combined configuration
console.log('=== Example 4: Combined Configuration ===\n');

const config: RouterConfig = {
  preferProvider: 'openai',
  maxCostPer1M: 10,
  requireCapabilities: ['coding'],
  fallbackModel: 'gpt-4.1',
};

const combinedRouter = new SmartRouter(config);
const tasks = [
  'format json',
  'write unit tests',
  'architect a payment system',
];

for (const t of tasks) {
  const r = combinedRouter.route(t);
  console.log(`Task: ${t}`);
  console.log(`  → ${r.model.provider}/${r.model.id} (${r.model.tier})`);
}
console.log();

// Example 5: Using routeTask with inline config
console.log('=== Example 5: Inline Configuration ===\n');

const inlineResult = routeTask('Build a caching layer', {
  preferProvider: 'google',
  maxCostPer1M: 15,
});

console.log(`Model: ${inlineResult.model.name}`);
console.log(`Provider: ${inlineResult.model.provider}`);
console.log(`Tier: ${inlineResult.analysis.tier}`);
