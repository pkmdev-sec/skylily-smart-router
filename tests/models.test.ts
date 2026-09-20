/**
 * Tests for Model Definitions
 * Smart Model Router - Skylily 🌸
 */

import { describe, it, expect } from 'vitest';
import {
  MODELS,
  MODEL_TIERS,
  ModelTier,
  getModelsByTier,
  getModelById,
  getCheapestModel,
  ModelDefinition,
} from '../src/models.js';

describe('MODELS', () => {
  it('should have at least 10 models defined', () => {
    const modelCount = Object.keys(MODELS).length;
    expect(modelCount).toBeGreaterThanOrEqual(10);
  });

  it('should have models for all tiers', () => {
    for (const tier of MODEL_TIERS) {
      const models = getModelsByTier(tier);
      expect(models.length).toBeGreaterThan(0);
    }
  });

  it('should have valid structure for all models', () => {
    for (const [key, model] of Object.entries(MODELS)) {
      // Check required fields
      expect(model.id).toBeDefined();
      expect(model.provider).toBeDefined();
      expect(model.name).toBeDefined();
      expect(MODEL_TIERS).toContain(model.tier);
      expect(Array.isArray(model.capabilities)).toBe(true);
      expect(model.capabilities.length).toBeGreaterThan(0);
      expect(model.contextWindow).toBeGreaterThan(0);
      expect(model.maxTokens).toBeGreaterThan(0);
      
      // Check cost structure
      expect(model.cost).toBeDefined();
      expect(model.cost.inputPer1M).toBeGreaterThanOrEqual(0);
      expect(model.cost.outputPer1M).toBeGreaterThan(0);
      
      // Check arrays
      expect(Array.isArray(model.strengths)).toBe(true);
      expect(Array.isArray(model.weaknesses)).toBe(true);
      
      // Check boolean
      expect(typeof model.reasoning).toBe('boolean');
    }
  });

  it('should have consistent key format (provider/id)', () => {
    for (const key of Object.keys(MODELS)) {
      expect(key).toMatch(/^[a-z]+\/[a-z0-9.-]+$/);
    }
  });

  it('should have ultra tier models with reasoning capability', () => {
    const ultraModels = getModelsByTier('ultra');
    const reasoningModels = ultraModels.filter(m => m.reasoning);
    expect(reasoningModels.length).toBeGreaterThan(0);
  });

  it('should have nano tier models that are cheap', () => {
    const nanoModels = getModelsByTier('nano');
    for (const model of nanoModels) {
      expect(model.cost.outputPer1M).toBeLessThan(1);
    }
  });
});

describe('getModelsByTier', () => {
  it('should return models for each tier', () => {
    expect(getModelsByTier('nano').length).toBeGreaterThan(0);
    expect(getModelsByTier('light').length).toBeGreaterThan(0);
    expect(getModelsByTier('standard').length).toBeGreaterThan(0);
    expect(getModelsByTier('heavy').length).toBeGreaterThan(0);
    expect(getModelsByTier('ultra').length).toBeGreaterThan(0);
  });

  it('should return only models of the specified tier', () => {
    const heavyModels = getModelsByTier('heavy');
    for (const model of heavyModels) {
      expect(model.tier).toBe('heavy');
    }
  });

  it('should return empty array for invalid tier', () => {
    // TypeScript will catch this at compile time, but runtime check
    const models = getModelsByTier('invalid' as ModelTier);
    expect(models).toEqual([]);
  });
});

describe('getModelById', () => {
  it('should find model by short id', () => {
    const model = getModelById('gpt-4.1-mini');
    expect(model).toBeDefined();
    expect(model?.id).toBe('gpt-4.1-mini');
  });

  it('should find model by full id (provider/model)', () => {
    const model = getModelById('openai/gpt-4.1-mini');
    expect(model).toBeDefined();
    expect(model?.id).toBe('gpt-4.1-mini');
  });

  it('should return undefined for non-existent model', () => {
    const model = getModelById('non-existent-model');
    expect(model).toBeUndefined();
  });

  it('should find anthropic models', () => {
    const opus = getModelById('claude-opus-4-5');
    expect(opus).toBeDefined();
    expect(opus?.provider).toBe('anthropic');
  });

  it('should find google models', () => {
    const gemini = getModelById('gemini-2.5-pro');
    expect(gemini).toBeDefined();
    expect(gemini?.provider).toBe('google');
  });
});

describe('getCheapestModel', () => {
  it('should return the cheapest model for each tier', () => {
    for (const tier of MODEL_TIERS) {
      const cheapest = getCheapestModel(tier);
      expect(cheapest).toBeDefined();
      
      const allInTier = getModelsByTier(tier);
      const minCost = Math.min(...allInTier.map(m => m.cost.outputPer1M));
      expect(cheapest?.cost.outputPer1M).toBe(minCost);
    }
  });

  it('should return nano models as cheapest overall', () => {
    const nanoCheapest = getCheapestModel('nano');
    const lightCheapest = getCheapestModel('light');
    
    expect(nanoCheapest!.cost.outputPer1M).toBeLessThan(lightCheapest!.cost.outputPer1M);
  });

  it('should return undefined for invalid tier', () => {
    const model = getCheapestModel('invalid' as ModelTier);
    expect(model).toBeUndefined();
  });
});

describe('Model Cost Ordering', () => {
  it('should have tiers ordered by typical cost', () => {
    const nanoCheapest = getCheapestModel('nano')!;
    const lightCheapest = getCheapestModel('light')!;
    const standardCheapest = getCheapestModel('standard')!;
    const heavyCheapest = getCheapestModel('heavy')!;
    const ultraCheapest = getCheapestModel('ultra')!;

    expect(nanoCheapest.cost.outputPer1M).toBeLessThan(lightCheapest.cost.outputPer1M);
    expect(lightCheapest.cost.outputPer1M).toBeLessThanOrEqual(standardCheapest.cost.outputPer1M);
    expect(standardCheapest.cost.outputPer1M).toBeLessThanOrEqual(heavyCheapest.cost.outputPer1M);
    expect(heavyCheapest.cost.outputPer1M).toBeLessThanOrEqual(ultraCheapest.cost.outputPer1M);
  });
});

describe('Model Capabilities', () => {
  it('should have coding models available', () => {
    const codingModels = Object.values(MODELS).filter(m => 
      m.capabilities.includes('coding')
    );
    expect(codingModels.length).toBeGreaterThan(0);
  });

  it('should have reasoning models available', () => {
    const reasoningModels = Object.values(MODELS).filter(m => 
      m.capabilities.includes('reasoning')
    );
    expect(reasoningModels.length).toBeGreaterThan(0);
  });

  it('should have vision models available', () => {
    const visionModels = Object.values(MODELS).filter(m => 
      m.capabilities.includes('vision')
    );
    expect(visionModels.length).toBeGreaterThan(0);
  });
});
