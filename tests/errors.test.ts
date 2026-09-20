/**
 * Tests for Error Classes
 * Smart Model Router - Skylily 🌸
 */

import { describe, it, expect } from 'vitest';
import {
  SmartRouterError,
  InvalidTaskError,
  NoModelFoundError,
  InvalidModelError,
  InvalidTierError,
  InvalidConfigError,
  isSmartRouterError,
  getErrorMessage,
} from '../src/errors.js';

describe('SmartRouterError', () => {
  it('should create error with message and code', () => {
    const error = new SmartRouterError('Something went wrong', 'TEST_ERROR');
    
    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('SmartRouterError');
  });

  it('should support suggestion', () => {
    const error = new SmartRouterError(
      'Something went wrong',
      'TEST_ERROR',
      'Try doing X instead'
    );
    
    expect(error.suggestion).toBe('Try doing X instead');
  });

  it('should format error string', () => {
    const error = new SmartRouterError(
      'Failed',
      'FAIL_CODE',
      'Try again'
    );
    
    const formatted = error.toFormattedString();
    expect(formatted).toContain('[FAIL_CODE]');
    expect(formatted).toContain('Failed');
    expect(formatted).toContain('Suggestion');
    expect(formatted).toContain('Try again');
  });

  it('should format without suggestion', () => {
    const error = new SmartRouterError('Failed', 'FAIL_CODE');
    const formatted = error.toFormattedString();
    
    expect(formatted).toBe('[FAIL_CODE] Failed');
    expect(formatted).not.toContain('Suggestion');
  });

  it('should extend Error', () => {
    const error = new SmartRouterError('msg', 'CODE');
    expect(error instanceof Error).toBe(true);
  });

  it('should have stack trace', () => {
    const error = new SmartRouterError('msg', 'CODE');
    expect(error.stack).toBeDefined();
  });
});

describe('InvalidTaskError', () => {
  it('should create with reason', () => {
    const error = new InvalidTaskError('empty string');
    
    expect(error.message).toContain('empty string');
    expect(error.code).toBe('INVALID_TASK');
    expect(error.name).toBe('InvalidTaskError');
    expect(error.suggestion).toBeDefined();
  });

  it('should extend SmartRouterError', () => {
    const error = new InvalidTaskError('test');
    expect(error instanceof SmartRouterError).toBe(true);
  });
});

describe('NoModelFoundError', () => {
  it('should list constraints', () => {
    const error = new NoModelFoundError({
      provider: 'anthropic',
      maxCost: 0.5,
    });
    
    expect(error.message).toContain('anthropic');
    expect(error.message).toContain('0.5');
    expect(error.code).toBe('NO_MODEL_FOUND');
    expect(error.constraints).toEqual({ provider: 'anthropic', maxCost: 0.5 });
  });

  it('should filter undefined constraints', () => {
    const error = new NoModelFoundError({
      provider: 'openai',
      maxCost: undefined,
    });
    
    expect(error.message).toContain('openai');
    expect(error.message).not.toContain('maxCost');
  });
});

describe('InvalidModelError', () => {
  it('should include model ID', () => {
    const error = new InvalidModelError('nonexistent-model');
    
    expect(error.message).toContain('nonexistent-model');
    expect(error.code).toBe('INVALID_MODEL');
    expect(error.modelId).toBe('nonexistent-model');
  });
});

describe('InvalidTierError', () => {
  it('should include invalid tier and valid options', () => {
    const error = new InvalidTierError('mega');
    
    expect(error.message).toContain('mega');
    expect(error.code).toBe('INVALID_TIER');
    expect(error.tier).toBe('mega');
    expect(error.validTiers).toContain('nano');
    expect(error.validTiers).toContain('ultra');
    expect(error.suggestion).toContain('nano');
  });
});

describe('InvalidConfigError', () => {
  it('should include field and reason', () => {
    const error = new InvalidConfigError('maxCostPer1M', 'must be positive');
    
    expect(error.message).toContain('maxCostPer1M');
    expect(error.message).toContain('must be positive');
    expect(error.code).toBe('INVALID_CONFIG');
    expect(error.field).toBe('maxCostPer1M');
  });
});

describe('isSmartRouterError', () => {
  it('should return true for SmartRouterError', () => {
    const error = new SmartRouterError('test', 'TEST');
    expect(isSmartRouterError(error)).toBe(true);
  });

  it('should return true for subclasses', () => {
    expect(isSmartRouterError(new InvalidTaskError('test'))).toBe(true);
    expect(isSmartRouterError(new NoModelFoundError({}))).toBe(true);
    expect(isSmartRouterError(new InvalidModelError('test'))).toBe(true);
    expect(isSmartRouterError(new InvalidTierError('test'))).toBe(true);
    expect(isSmartRouterError(new InvalidConfigError('f', 'r'))).toBe(true);
  });

  it('should return false for regular Error', () => {
    expect(isSmartRouterError(new Error('test'))).toBe(false);
  });

  it('should return false for non-errors', () => {
    expect(isSmartRouterError('string')).toBe(false);
    expect(isSmartRouterError(null)).toBe(false);
    expect(isSmartRouterError(undefined)).toBe(false);
    expect(isSmartRouterError({})).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('should extract message from Error', () => {
    const error = new Error('test message');
    expect(getErrorMessage(error)).toBe('test message');
  });

  it('should extract message from SmartRouterError', () => {
    const error = new SmartRouterError('router error', 'CODE');
    expect(getErrorMessage(error)).toBe('router error');
  });

  it('should return string as-is', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('should handle unknown types', () => {
    expect(getErrorMessage(null)).toBe('Unknown error occurred');
    expect(getErrorMessage(undefined)).toBe('Unknown error occurred');
    expect(getErrorMessage(123)).toBe('Unknown error occurred');
    expect(getErrorMessage({})).toBe('Unknown error occurred');
  });
});

describe('error chaining', () => {
  it('should work with try-catch', () => {
    let caught: unknown;
    
    try {
      throw new InvalidTaskError('empty');
    } catch (e) {
      caught = e;
    }
    
    expect(caught).toBeDefined();
    expect(isSmartRouterError(caught)).toBe(true);
    
    if (isSmartRouterError(caught)) {
      expect(caught.code).toBe('INVALID_TASK');
    }
  });
});
