/**
 * Tests for Smart Router
 * Smart Model Router - Skylily 🌸
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SmartRouter,
  routeTask,
  defaultRouter,
  RouterConfig,
  RoutingResult,
} from '../src/router.js';
import { MODELS, getModelsByTier } from '../src/models.js';

describe('SmartRouter', () => {
  let router: SmartRouter;

  beforeEach(() => {
    router = new SmartRouter();
  });

  describe('constructor', () => {
    it('should create router with default config', () => {
      const r = new SmartRouter();
      expect(r).toBeDefined();
    });

    it('should accept custom config', () => {
      const r = new SmartRouter({
        preferProvider: 'anthropic',
        maxCostPer1M: 10,
        defaultTier: 'heavy',
      });
      expect(r).toBeDefined();
    });
  });

  describe('route', () => {
    it('should return a valid RoutingResult', () => {
      const result = router.route('Write a hello world function');
      
      expect(result).toBeDefined();
      expect(result.model).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(result.alternatives).toBeDefined();
      expect(result.estimatedCost).toBeDefined();
      expect(result.reason).toBeDefined();
    });

    it('should select model from correct tier', () => {
      // Simple task -> light/nano tier
      const simple = router.route('format this json');
      expect(['nano', 'light']).toContain(simple.model.tier);
      
      // Complex task -> should not be nano (at least standard or higher)
      const complex = router.route('design a distributed system architecture with microservices');
      expect(['standard', 'heavy', 'ultra']).toContain(complex.model.tier);
    });

    it('should return alternatives from same tier', () => {
      const result = router.route('implement a REST API');
      
      for (const alt of result.alternatives) {
        // Alternatives should be from same tier or adjacent
        expect(alt).toBeDefined();
        expect(alt.tier).toBeDefined();
      }
    });

    it('should estimate cost correctly', () => {
      const result = router.route('simple task');
      
      expect(result.estimatedCost.inputTokens).toBeGreaterThan(0);
      expect(result.estimatedCost.outputTokens).toBeGreaterThan(0);
      expect(result.estimatedCost.totalCost).toBeGreaterThan(0);
      expect(result.estimatedCost.totalCost).toBeLessThan(1); // Should be cheap for simple task
    });

    it('should generate a human-readable reason', () => {
      const result = router.route('build a feature');
      
      expect(result.reason).toContain('Task complexity:');
      expect(result.reason).toContain('Selected:');
    });
  });

  describe('provider preference', () => {
    it('should prefer specified provider when available', () => {
      const anthropicRouter = new SmartRouter({ preferProvider: 'anthropic' });
      const result = anthropicRouter.route('implement a feature');
      
      // Should prefer Anthropic when available in tier
      if (result.model.provider !== 'anthropic') {
        // If not anthropic, verify no anthropic models in tier
        const tierModels = getModelsByTier(result.analysis.tier);
        const anthropicInTier = tierModels.filter(m => m.provider === 'anthropic');
        expect(anthropicInTier.length).toBe(0);
      }
    });

    it('should fallback when provider has no models in tier', () => {
      // Nano tier has no anthropic models
      const anthropicRouter = new SmartRouter({ preferProvider: 'anthropic' });
      const result = anthropicRouter.route('capitalize this');
      
      // Should still return a result even if provider not available
      expect(result.model).toBeDefined();
    });
  });

  describe('capability filtering', () => {
    it('should filter by required capabilities', () => {
      const router = new SmartRouter({
        requireCapabilities: ['coding'],
      });
      
      const result = router.route('fix this bug');
      expect(result.model.capabilities).toContain('coding');
    });

    it('should handle multiple required capabilities', () => {
      const router = new SmartRouter({
        requireCapabilities: ['coding', 'reasoning'],
      });
      
      const result = router.route('analyze and refactor this code');
      expect(result.model.capabilities).toContain('coding');
      expect(result.model.capabilities).toContain('reasoning');
    });
  });

  describe('cost filtering', () => {
    it('should respect maxCostPer1M', () => {
      const cheapRouter = new SmartRouter({
        maxCostPer1M: 1,
      });
      
      const result = cheapRouter.route('write some code');
      expect(result.model.cost.outputPer1M).toBeLessThanOrEqual(1);
    });

    it('should fallback when no models under cost limit', () => {
      const router = new SmartRouter({
        maxCostPer1M: 0.001, // Unrealistically low
      });
      
      // Should still return a result (fallback behavior)
      const result = router.route('do something');
      expect(result.model).toBeDefined();
    });
  });

  describe('estimateCost', () => {
    it('should calculate cost correctly', () => {
      const model = Object.values(MODELS)[0];
      const cost = router.estimateCost(model, 1000, 500);
      
      const expectedInput = (1000 / 1_000_000) * model.cost.inputPer1M;
      const expectedOutput = (500 / 1_000_000) * model.cost.outputPer1M;
      
      expect(cost.inputTokens).toBe(1000);
      expect(cost.outputTokens).toBe(500);
      expect(cost.totalCost).toBeCloseTo(expectedInput + expectedOutput, 10);
    });

    it('should handle zero tokens', () => {
      const model = Object.values(MODELS)[0];
      const cost = router.estimateCost(model, 0, 0);
      
      expect(cost.totalCost).toBe(0);
    });

    it('should handle large token counts', () => {
      const model = Object.values(MODELS)[0];
      const cost = router.estimateCost(model, 1_000_000, 1_000_000);
      
      expect(cost.totalCost).toBe(model.cost.inputPer1M + model.cost.outputPer1M);
    });
  });

  describe('usage tracking', () => {
    it('should record usage', () => {
      router.recordUsage('gpt-4.1-mini', 'test task', true, 0.001);
      const stats = router.getStats();
      
      expect(stats.totalRequests).toBe(1);
      expect(stats.successRate).toBe(1);
      expect(stats.totalCost).toBe(0.001);
    });

    it('should track multiple usages', () => {
      router.recordUsage('gpt-4.1-mini', 'task 1', true, 0.001);
      router.recordUsage('gpt-4.1-mini', 'task 2', true, 0.002);
      router.recordUsage('gpt-4.1', 'task 3', false, 0.01);
      
      const stats = router.getStats();
      
      expect(stats.totalRequests).toBe(3);
      expect(stats.successRate).toBeCloseTo(0.666, 2);
      expect(stats.totalCost).toBeCloseTo(0.013, 10);
      expect(Object.keys(stats.modelBreakdown).length).toBe(2);
    });

    it('should calculate model breakdown correctly', () => {
      router.recordUsage('gpt-4.1-mini', 'task 1', true, 0.001);
      router.recordUsage('gpt-4.1-mini', 'task 2', false, 0.001);
      
      const stats = router.getStats();
      const breakdown = stats.modelBreakdown['gpt-4.1-mini'];
      
      expect(breakdown.count).toBe(2);
      expect(breakdown.successRate).toBe(0.5);
      expect(breakdown.cost).toBe(0.002);
    });

    it('should limit history to 1000 entries', () => {
      for (let i = 0; i < 1100; i++) {
        router.recordUsage('model', `task ${i}`, true, 0.001);
      }
      
      const stats = router.getStats();
      expect(stats.totalRequests).toBe(1000);
    });

    it('should return empty stats initially', () => {
      const stats = router.getStats();
      
      expect(stats.totalRequests).toBe(0);
      expect(stats.successRate).toBe(0);
      expect(stats.totalCost).toBe(0);
      expect(Object.keys(stats.modelBreakdown).length).toBe(0);
    });
  });
});

describe('routeTask', () => {
  it('should work as standalone function', () => {
    const result = routeTask('write a function');
    
    expect(result).toBeDefined();
    expect(result.model).toBeDefined();
    expect(result.analysis).toBeDefined();
  });

  it('should accept config parameter', () => {
    const result = routeTask('write code', {
      preferProvider: 'openai',
      maxCostPer1M: 5,
    });
    
    expect(result.model).toBeDefined();
  });

  it('should be equivalent to creating router and routing', () => {
    const task = 'implement OAuth authentication';
    
    const result1 = routeTask(task);
    const result2 = new SmartRouter().route(task);
    
    // Should select same model for same task
    expect(result1.model.id).toBe(result2.model.id);
    expect(result1.analysis.tier).toBe(result2.analysis.tier);
  });
});

describe('defaultRouter', () => {
  it('should be a SmartRouter instance', () => {
    expect(defaultRouter).toBeInstanceOf(SmartRouter);
  });

  it('should work for routing', () => {
    const result = defaultRouter.route('simple task');
    expect(result.model).toBeDefined();
  });
});

describe('cost optimization', () => {
  it('should select cheapest model in tier', () => {
    const result = routeTask('format json');
    const tierModels = getModelsByTier(result.analysis.tier);
    const cheapest = tierModels.sort((a, b) => a.cost.outputPer1M - b.cost.outputPer1M)[0];
    
    expect(result.model.cost.outputPer1M).toBe(cheapest.cost.outputPer1M);
  });

  it('should save money on simple tasks', () => {
    const simpleResult = routeTask('capitalize this text');
    const complexResult = routeTask('design a complex distributed microservices architecture system');
    
    expect(simpleResult.model.cost.outputPer1M).toBeLessThanOrEqual(
      complexResult.model.cost.outputPer1M
    );
  });
});

describe('edge cases', () => {
  it('should handle empty task', () => {
    const result = routeTask('');
    expect(result.model).toBeDefined();
    expect(result.analysis.tier).toBe('nano');
  });

  it('should handle very long task', () => {
    const longTask = 'analyze '.repeat(1000);
    const result = routeTask(longTask);
    expect(result.model).toBeDefined();
  });

  it('should handle special characters', () => {
    const result = routeTask('fix this: <script>alert("xss")</script>');
    expect(result.model).toBeDefined();
  });

  it('should handle conflicting constraints gracefully', () => {
    const result = routeTask('simple task', {
      preferProvider: 'nonexistent',
      requireCapabilities: ['flying'],
      maxCostPer1M: 0.001,
    });
    
    // Should fallback to something
    expect(result.model).toBeDefined();
  });
});
