/**
 * Basic Usage Example
 * Smart Model Router - Skylily 🌸
 * 
 * Run: npx ts-node examples/basic-usage.ts
 * Or: npx tsx examples/basic-usage.ts
 */

import { routeTask, analyzeTask } from '../src/index.js';

// Example 1: Simple routing
console.log('=== Example 1: Simple Routing ===\n');

const simpleTask = 'Write a hello world function in Python';
const simpleResult = routeTask(simpleTask);

console.log(`Task: ${simpleTask}`);
console.log(`Selected Model: ${simpleResult.model.name}`);
console.log(`Tier: ${simpleResult.analysis.tier}`);
console.log(`Estimated Cost: $${simpleResult.estimatedCost.totalCost.toFixed(6)}`);
console.log(`Reason: ${simpleResult.reason}`);
console.log();

// Example 2: Complex task routing
console.log('=== Example 2: Complex Task Routing ===\n');

const complexTask = 'Design a distributed consensus algorithm for a blockchain network';
const complexResult = routeTask(complexTask);

console.log(`Task: ${complexTask}`);
console.log(`Selected Model: ${complexResult.model.name}`);
console.log(`Tier: ${complexResult.analysis.tier}`);
console.log(`Estimated Cost: $${complexResult.estimatedCost.totalCost.toFixed(6)}`);
console.log(`Reason: ${complexResult.reason}`);
console.log();

// Example 3: Just analyze without routing
console.log('=== Example 3: Analysis Only ===\n');

const analysisTask = 'Refactor the entire authentication module to use OAuth 2.0';
const analysis = analyzeTask(analysisTask);

console.log(`Task: ${analysisTask}`);
console.log(`Complexity Tier: ${analysis.tier}`);
console.log(`Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
console.log(`Signals: ${analysis.signals.slice(0, 5).join(', ')}`);
console.log(`Required Capabilities: ${analysis.suggestedCapabilities.join(', ')}`);
console.log(`Reasoning: ${analysis.reasoning}`);
console.log();

// Example 4: Cost comparison
console.log('=== Example 4: Cost Comparison ===\n');

const tasks = [
  'capitalize this text',
  'format this JSON object',
  'write a helper function',
  'implement user authentication',
  'design microservices architecture',
];

console.log('Task                              | Model              | Tier     | Cost');
console.log('----------------------------------+--------------------+----------+--------');

for (const task of tasks) {
  const result = routeTask(task);
  const taskPadded = task.slice(0, 32).padEnd(32);
  const modelPadded = result.model.name.slice(0, 18).padEnd(18);
  const tierPadded = result.analysis.tier.padEnd(8);
  const cost = `$${result.estimatedCost.totalCost.toFixed(6)}`;
  
  console.log(`${taskPadded} | ${modelPadded} | ${tierPadded} | ${cost}`);
}
