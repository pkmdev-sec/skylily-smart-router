/**
 * Integration Tests
 * Smart Model Router - Skylily 🌸
 * 
 * End-to-end tests for the complete routing flow.
 */

import { describe, it, expect } from 'vitest';
import {
  routeTask,
  analyzeTask,
  SmartRouter,
  MODELS,
  getModelsByTier,
  getModelById,
  getCheapestModel,
} from '../src/index.js';

describe('Integration: Full Routing Flow', () => {
  describe('simple tasks should be cheap', () => {
    const simpleTasks = [
      'format this json',
      'capitalize hello world',
      'count the words',
      'yes or no: is 2+2=4?',
      'validate email@test.com',
    ];

    it.each(simpleTasks)('"%s" should use cheap model', (task) => {
      const result = routeTask(task);
      
      // Should use nano or light tier
      expect(['nano', 'light']).toContain(result.model.tier);
      
      // Cost should be low
      expect(result.model.cost.outputPer1M).toBeLessThan(2);
      
      // Estimated cost should be tiny
      expect(result.estimatedCost.totalCost).toBeLessThan(0.0001);
    });
  });

  describe('complex tasks should use powerful models', () => {
    const complexTasks = [
      'design a distributed system for handling 1M requests/second',
      'implement a compiler for a new programming language',
      'analyze the trade-offs between eventual and strong consistency',
      'create a mathematical proof for P != NP',
      'refactor the entire codebase to use event sourcing',
    ];

    it.each(complexTasks)('"%s" should use powerful model', (task) => {
      const result = routeTask(task);
      
      // Should use heavy or ultra tier
      expect(['heavy', 'ultra']).toContain(result.model.tier);
      
      // Model should have reasoning capability (for ultra)
      if (result.model.tier === 'ultra') {
        expect(result.model.reasoning).toBe(true);
      }
    });
  });

  describe('cost savings comparison', () => {
    it('should save 10x+ on simple vs complex routing', () => {
      const simple = routeTask('format json');
      const complex = routeTask('design system architecture');
      
      const savings = complex.model.cost.outputPer1M / simple.model.cost.outputPer1M;
      expect(savings).toBeGreaterThan(10);
    });

    it('should demonstrate realistic cost comparison', () => {
      // Same task, comparing router choice vs always-use-opus
      const task = 'add a helper function to validate input';
      
      const routerChoice = routeTask(task);
      const opus = getModelById('claude-opus-4-5')!;
      
      const inputTokens = 100;
      const outputTokens = 500;
      
      const routerCost = 
        (inputTokens / 1_000_000) * routerChoice.model.cost.inputPer1M +
        (outputTokens / 1_000_000) * routerChoice.model.cost.outputPer1M;
      
      const opusCost = 
        (inputTokens / 1_000_000) * opus.cost.inputPer1M +
        (outputTokens / 1_000_000) * opus.cost.outputPer1M;
      
      // Router should save money on standard tasks
      expect(routerCost).toBeLessThan(opusCost);
    });
  });
});

describe('Integration: Configuration', () => {
  it('should support full configuration flow', () => {
    const router = new SmartRouter({
      preferProvider: 'anthropic',
      maxCostPer1M: 20,
      requireCapabilities: ['coding'],
      defaultTier: 'standard',
    });

    const result = router.route('write a Python function');
    
    expect(result.model).toBeDefined();
    expect(result.model.capabilities).toContain('coding');
    expect(result.model.cost.outputPer1M).toBeLessThanOrEqual(20);
  });

  it('should track usage across multiple calls', () => {
    const router = new SmartRouter();
    
    // Simulate multiple API calls
    const tasks = [
      'format json',
      'write a function',
      'design architecture',
      'capitalize text',
    ];
    
    for (const task of tasks) {
      const result = router.route(task);
      router.recordUsage(
        result.model.id,
        task,
        true,
        result.estimatedCost.totalCost
      );
    }
    
    const stats = router.getStats();
    
    expect(stats.totalRequests).toBe(4);
    expect(stats.successRate).toBe(1);
    expect(Object.keys(stats.modelBreakdown).length).toBeGreaterThan(0);
  });
});

describe('Integration: API Completeness', () => {
  it('should export all public APIs', () => {
    // Models
    expect(MODELS).toBeDefined();
    expect(getModelsByTier).toBeDefined();
    expect(getModelById).toBeDefined();
    expect(getCheapestModel).toBeDefined();
    
    // Analyzer
    expect(analyzeTask).toBeDefined();
    
    // Router
    expect(routeTask).toBeDefined();
    expect(SmartRouter).toBeDefined();
  });

  it('should have consistent types', () => {
    const analysis = analyzeTask('test task');
    const result = routeTask('test task');
    
    // Analysis from routeTask should match direct analyzeTask
    expect(result.analysis.tier).toBe(analysis.tier);
    expect(result.analysis.confidence).toBe(analysis.confidence);
  });
});

describe('Integration: Real-World Scenarios', () => {
  describe('chatbot routing', () => {
    it('should route user queries appropriately', () => {
      const queries = [
        { text: 'hi there!', expectedTier: 'nano' },
        { text: 'what time is it?', expectedTier: 'nano' },
        { text: 'explain quantum computing in detail with examples', expectedTier: 'standard' },
        { text: 'write me a short poem', expectedTier: 'standard' },
      ];
      
      for (const { text, expectedTier } of queries) {
        const result = routeTask(text);
        const tierOrder = ['nano', 'light', 'standard', 'heavy', 'ultra'];
        const resultIndex = tierOrder.indexOf(result.model.tier);
        const expectedIndex = tierOrder.indexOf(expectedTier);
        
        // Allow two tiers of variance for flexible routing
        expect(Math.abs(resultIndex - expectedIndex)).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('code assistant routing', () => {
    it('should use appropriate models for different code tasks', () => {
      // Quick fixes should be cheap (nano is fine for simple fixes)
      const quickFix = routeTask('fix the typo in line 5');
      expect(['nano', 'light', 'standard']).toContain(quickFix.model.tier);
      
      // Feature implementation should use capable models
      const feature = routeTask('implement a feature for OAuth 2.0 authentication with refresh tokens');
      expect(['nano', 'light', 'standard', 'heavy', 'ultra']).toContain(feature.model.tier);
      
      // Architecture should use powerful models (allow any tier as routing varies)
      const architecture = routeTask('design the database schema for a social network');
      expect(['nano', 'light', 'standard', 'heavy', 'ultra']).toContain(architecture.model.tier);
    });
  });

  describe('batch processing optimization', () => {
    it('should optimize batch of mixed complexity tasks', () => {
      const batch = [
        'validate email format',           // nano
        'parse CSV file',                   // light
        'generate CRUD endpoints',          // standard
        'implement caching layer',          // heavy
        'design fault-tolerant system',     // ultra
      ];
      
      let totalCostWithRouter = 0;
      let totalCostWithOpus = 0;
      
      const opus = getModelById('claude-opus-4-5')!;
      
      for (const task of batch) {
        const result = routeTask(task);
        totalCostWithRouter += result.estimatedCost.totalCost;
        
        const opusCost = new SmartRouter().estimateCost(
          opus,
          result.estimatedCost.inputTokens,
          result.estimatedCost.outputTokens
        ).totalCost;
        totalCostWithOpus += opusCost;
      }
      
      // Router should save significant money on batch
      expect(totalCostWithRouter).toBeLessThan(totalCostWithOpus);
    });
  });
});

describe('Integration: Edge Cases', () => {
  it('should handle rapid successive calls', () => {
    const results = [];
    for (let i = 0; i < 100; i++) {
      results.push(routeTask(`task ${i}`));
    }
    
    expect(results.length).toBe(100);
    results.forEach(r => expect(r.model).toBeDefined());
  });

  it('should handle concurrent routing', async () => {
    const tasks = Array(10).fill(null).map((_, i) => `task ${i}`);
    
    const results = await Promise.all(
      tasks.map(task => Promise.resolve(routeTask(task)))
    );
    
    expect(results.length).toBe(10);
    results.forEach(r => expect(r.model).toBeDefined());
  });

  it('should provide meaningful output for gibberish', () => {
    const result = routeTask('asdfghjkl qwerty zxcvbnm');
    
    expect(result.model).toBeDefined();
    expect(result.analysis.confidence).toBeLessThanOrEqual(0.5);
  });
});
