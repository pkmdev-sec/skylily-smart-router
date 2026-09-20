/**
 * Usage Tracking Example
 * Smart Model Router - Skylily 🌸
 * 
 * Shows how to track API usage and analyze patterns.
 * 
 * Run: npx ts-node examples/usage-tracking.ts
 * Or: npx tsx examples/usage-tracking.ts
 */

import { SmartRouter } from '../src/index.js';

// Create router with tracking
const router = new SmartRouter({
  preferProvider: 'openai',
});

// Simulate a series of API calls
console.log('=== Simulating API Usage ===\n');

const tasks = [
  { text: 'format json', success: true },
  { text: 'format xml', success: true },
  { text: 'capitalize text', success: true },
  { text: 'write a function to sort arrays', success: true },
  { text: 'implement binary search', success: true },
  { text: 'debug this code', success: false }, // Simulated failure
  { text: 'design database schema', success: true },
  { text: 'create REST API', success: true },
  { text: 'build authentication flow', success: true },
  { text: 'architect microservices', success: true },
];

for (const task of tasks) {
  const result = router.route(task.text);
  
  // Simulate actual API cost (would come from real API response)
  const actualCost = result.estimatedCost.totalCost * (0.8 + Math.random() * 0.4);
  
  // Record the usage
  router.recordUsage(
    result.model.id,
    task.text,
    task.success,
    actualCost
  );
  
  console.log(`✓ ${task.text.slice(0, 30).padEnd(30)} → ${result.model.id.padEnd(15)} ${task.success ? '✅' : '❌'}`);
}

// Get statistics
console.log('\n=== Usage Statistics ===\n');

const stats = router.getStats();

console.log(`Total Requests: ${stats.totalRequests}`);
console.log(`Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
console.log(`Total Cost: $${stats.totalCost.toFixed(6)}`);

console.log('\n=== Model Breakdown ===\n');

console.log('Model           | Count | Success | Cost');
console.log('----------------+-------+---------+--------');

for (const [model, data] of Object.entries(stats.modelBreakdown)) {
  const modelPadded = model.slice(0, 15).padEnd(15);
  const count = String(data.count).padStart(5);
  const success = `${(data.successRate * 100).toFixed(0)}%`.padStart(7);
  const cost = `$${data.cost.toFixed(6)}`;
  
  console.log(`${modelPadded} | ${count} | ${success} | ${cost}`);
}

// Calculate savings vs always using expensive model
console.log('\n=== Cost Savings Analysis ===\n');

const expensiveModelCost = 75; // Opus output per 1M
const totalTokens = tasks.length * 500; // Estimated 500 output tokens per task
const withoutRouter = (totalTokens / 1_000_000) * expensiveModelCost;
const withRouter = stats.totalCost;
const savings = ((withoutRouter - withRouter) / withoutRouter * 100).toFixed(1);

console.log(`Cost without router (always Opus): $${withoutRouter.toFixed(6)}`);
console.log(`Cost with smart routing: $${withRouter.toFixed(6)}`);
console.log(`Savings: ${savings}%`);
