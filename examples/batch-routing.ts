/**
 * Batch Routing Example
 * Smart Model Router - Skylily 🌸
 * 
 * Shows how to efficiently route a batch of tasks.
 * 
 * Run: npx ts-node examples/batch-routing.ts
 * Or: npx tsx examples/batch-routing.ts
 */

import { routeTask, analyzeTask, SmartRouter, RoutingResult } from '../src/index.js';

// Define a batch of tasks (simulating a queue of user requests)
const taskBatch = [
  // Trivial tasks (should use nano)
  'Is this email valid: test@example.com?',
  'Capitalize: hello world',
  'Count words in: The quick brown fox',
  
  // Simple tasks (should use light)
  'Format this JSON: {"name":"John","age":30}',
  'Extract all URLs from this text',
  'Parse this CSV row: name,age,city',
  
  // Standard tasks (should use standard)
  'Write a function to validate passwords',
  'Generate a TypeScript interface for User',
  'How do I use async/await in JavaScript?',
  
  // Complex tasks (should use heavy)
  'Implement a rate limiter middleware',
  'Write comprehensive unit tests for this API',
  'Debug this memory leak issue in our Node.js app',
  
  // Advanced tasks (should use ultra)
  'Design a distributed caching system for global CDN',
  'Architect a real-time collaborative editing system like Google Docs',
];

// Batch routing with analysis
console.log('=== Batch Routing Analysis ===\n');

interface BatchResult {
  task: string;
  tier: string;
  model: string;
  cost: number;
}

const results: BatchResult[] = [];
const tierCounts: Record<string, number> = {
  nano: 0,
  light: 0,
  standard: 0,
  heavy: 0,
  ultra: 0,
};

for (const task of taskBatch) {
  const result = routeTask(task);
  
  results.push({
    task: task.slice(0, 50),
    tier: result.analysis.tier,
    model: result.model.id,
    cost: result.estimatedCost.totalCost,
  });
  
  tierCounts[result.analysis.tier]++;
}

// Print results
console.log('Task (truncated)                                   | Tier     | Model');
console.log('---------------------------------------------------+----------+------------------');

for (const r of results) {
  console.log(`${r.task.padEnd(50)} | ${r.tier.padEnd(8)} | ${r.model}`);
}

// Tier distribution
console.log('\n=== Tier Distribution ===\n');

const total = taskBatch.length;
for (const [tier, count] of Object.entries(tierCounts)) {
  const percentage = ((count / total) * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(count / total * 20));
  console.log(`${tier.padEnd(8)} | ${bar.padEnd(20)} | ${count} (${percentage}%)`);
}

// Cost analysis
console.log('\n=== Cost Analysis ===\n');

const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
const avgCost = totalCost / results.length;

console.log(`Total estimated cost: $${totalCost.toFixed(6)}`);
console.log(`Average cost per task: $${avgCost.toFixed(6)}`);

// Group by tier for cost breakdown
const tierCosts: Record<string, { count: number; totalCost: number }> = {};
for (const r of results) {
  if (!tierCosts[r.tier]) {
    tierCosts[r.tier] = { count: 0, totalCost: 0 };
  }
  tierCosts[r.tier].count++;
  tierCosts[r.tier].totalCost += r.cost;
}

console.log('\nCost by Tier:');
console.log('Tier     | Tasks | Total Cost    | Avg Cost');
console.log('---------+-------+---------------+-----------');

for (const [tier, data] of Object.entries(tierCosts).sort()) {
  const avgTierCost = data.totalCost / data.count;
  console.log(
    `${tier.padEnd(8)} | ${String(data.count).padStart(5)} | ` +
    `$${data.totalCost.toFixed(6).padStart(12)} | ` +
    `$${avgTierCost.toFixed(6)}`
  );
}

// Efficiency recommendation
console.log('\n=== Efficiency Recommendations ===\n');

if (tierCounts.ultra > tierCounts.nano + tierCounts.light) {
  console.log('⚠️  Many complex tasks detected. Consider:');
  console.log('   - Breaking down complex tasks into subtasks');
  console.log('   - Caching results for similar requests');
} else if (tierCounts.nano + tierCounts.light > total * 0.7) {
  console.log('✅ Good task distribution! Most tasks using cheap models.');
} else {
  console.log('📊 Balanced task distribution across tiers.');
}
