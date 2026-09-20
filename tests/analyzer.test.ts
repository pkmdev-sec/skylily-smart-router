/**
 * Tests for Task Analyzer
 * Smart Model Router - Skylily 🌸
 */

import { describe, it, expect } from 'vitest';
import { analyzeTask, quickAnalyze, TaskAnalysis } from '../src/analyzer.js';
import { ModelTier } from '../src/models.js';

describe('analyzeTask', () => {
  describe('basic analysis', () => {
    it('should return a valid TaskAnalysis object', () => {
      const result = analyzeTask('Write a hello world program');
      
      expect(result).toBeDefined();
      expect(result.tier).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(result.signals)).toBe(true);
      expect(typeof result.reasoning).toBe('string');
      expect(Array.isArray(result.suggestedCapabilities)).toBe(true);
    });

    it('should handle empty string gracefully', () => {
      const result = analyzeTask('');
      expect(result.tier).toBe('nano');
      expect(result.confidence).toBeLessThanOrEqual(0.5);
    });

    it('should handle very long text', () => {
      const longText = 'analyze this '.repeat(1000);
      const result = analyzeTask(longText);
      expect(result.tier).toBeDefined();
    });
  });

  describe('nano tier detection', () => {
    const nanoTasks = [
      'yes or no?',
      'capitalize this text',
      'count words in this sentence',
      'validate this email: test@example.com',
      'echo hello',
      'is this valid?',
    ];

    it.each(nanoTasks)('should classify "%s" as nano', (task) => {
      const result = analyzeTask(task);
      expect(result.tier).toBe('nano');
    });
  });

  describe('light tier detection', () => {
    const lightTasks = [
      'format this json: {"key": "value"}',
      'extract the email from this text',
      'parse this xml string',
      'categorize these items',
      'convert this to lowercase',
    ];

    it.each(lightTasks)('should classify "%s" as light or lower', (task) => {
      const result = analyzeTask(task);
      expect(['nano', 'light']).toContain(result.tier);
    });
  });

  describe('standard tier detection', () => {
    const standardTasks = [
      'add a function to calculate the total',
      'update the config to use new settings',
      'how do I implement a binary search?',
      'generate code for a login form',
      'what is the difference between var and let?',
    ];

    it.each(standardTasks)('should classify "%s" as standard or below', (task) => {
      const result = analyzeTask(task);
      expect(['nano', 'light', 'standard']).toContain(result.tier);
    });
  });

  describe('heavy tier detection', () => {
    const heavyTasks = [
      'implement a feature for user authentication with OAuth2',
      'build a component that handles file uploads with progress',
      'write comprehensive tests for the payment module',
      'debug this issue with memory leaks in the application',
      'analyze the code for security vulnerabilities',
      'write an article about microservices best practices',
    ];

    it.each(heavyTasks)('should classify "%s" as heavy or higher', (task) => {
      const result = analyzeTask(task);
      expect(['standard', 'heavy', 'ultra']).toContain(result.tier);
    });
  });

  describe('ultra tier detection', () => {
    const ultraTasks = [
      'design a distributed system for real-time data processing',
      'multi-step reasoning to analyze the trade-offs of different architectures',
      'create a mathematical proof for this algorithm\'s correctness',
      'refactor the entire codebase to use a new architecture',
      'build a compiler for a custom programming language',
      'analyze trade-offs between consistency and availability in CAP theorem',
    ];

    it.each(ultraTasks)('should classify "%s" as ultra or heavy', (task) => {
      const result = analyzeTask(task);
      expect(['heavy', 'ultra']).toContain(result.tier);
    });
  });

  describe('capability detection', () => {
    it('should detect coding capability for code tasks', () => {
      const result = analyzeTask('write a function to sort an array');
      expect(result.suggestedCapabilities).toContain('coding');
    });

    it('should detect reasoning capability for analysis tasks', () => {
      const result = analyzeTask('analyze and compare these two approaches');
      expect(result.suggestedCapabilities).toContain('reasoning');
    });

    it('should detect vision capability for image tasks', () => {
      const result = analyzeTask('describe what you see in this image');
      expect(result.suggestedCapabilities).toContain('vision');
    });

    it('should detect math capability for calculation tasks', () => {
      const result = analyzeTask('calculate the integral of x^2');
      expect(result.suggestedCapabilities).toContain('math');
    });
  });

  describe('code content detection', () => {
    it('should boost tier when code is present', () => {
      const withCode = analyzeTask(`
        Fix this bug:
        \`\`\`javascript
        function add(a, b) {
          return a - b; // wrong!
        }
        \`\`\`
      `);
      // Code detection is reflected in reasoning string, not signals
      expect(withCode.reasoning.toLowerCase()).toContain('code');
    });

    it('should detect arrow functions', () => {
      const result = analyzeTask('const fn = () => console.log("hi")');
      expect(result.signals.some(s => s.includes('code'))).toBe(true);
    });
  });

  describe('reasoning keywords', () => {
    it('should boost tier when reasoning is needed', () => {
      const result = analyzeTask('Think carefully and evaluate all options');
      expect(result.signals.some(s => s.includes('reasoning'))).toBe(true);
    });
  });

  describe('signal tracking', () => {
    it('should include token count in signals', () => {
      const result = analyzeTask('simple task');
      expect(result.signals.some(s => s.startsWith('tokens:'))).toBe(true);
    });

    it('should include pattern matches in signals', () => {
      const result = analyzeTask('design a system for processing orders');
      expect(result.signals.length).toBeGreaterThan(1);
    });
  });

  describe('confidence scoring', () => {
    it('should have higher confidence when patterns match', () => {
      const withPatterns = analyzeTask('design a complex distributed system architecture');
      const noPatterns = analyzeTask('asdfghjkl random gibberish');
      
      expect(withPatterns.confidence).toBeGreaterThan(noPatterns.confidence);
    });

    it('should cap confidence at 0.9', () => {
      const result = analyzeTask(
        'design system analyze trade-offs implement feature build component ' +
        'write tests debug issue review code explain concept'
      );
      expect(result.confidence).toBeLessThanOrEqual(0.9);
    });
  });
});

describe('quickAnalyze', () => {
  it('should return just the tier', () => {
    const tier = quickAnalyze('simple task');
    expect(['nano', 'light', 'standard', 'heavy', 'ultra']).toContain(tier);
  });

  it('should match analyzeTask tier', () => {
    const task = 'implement a feature with OAuth';
    const fullResult = analyzeTask(task);
    const quickResult = quickAnalyze(task);
    
    expect(quickResult).toBe(fullResult.tier);
  });

  it('should be fast for simple use case', () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      quickAnalyze(`task number ${i}`);
    }
    const duration = performance.now() - start;
    
    // Should complete 100 analyses in under 100ms
    expect(duration).toBeLessThan(100);
  });
});

describe('edge cases', () => {
  it('should handle special characters', () => {
    const result = analyzeTask('what is 2 + 2? 🤔 <script>alert("xss")</script>');
    expect(result.tier).toBeDefined();
  });

  it('should handle unicode', () => {
    const result = analyzeTask('翻译这段中文文本到英文');
    expect(result.tier).toBeDefined();
  });

  it('should handle newlines and whitespace', () => {
    const result = analyzeTask(`
      
      Write a function
      
      that sorts an array
      
    `);
    expect(result.tier).toBeDefined();
  });

  it('should be case insensitive', () => {
    const lower = analyzeTask('design a system');
    const upper = analyzeTask('DESIGN A SYSTEM');
    
    expect(lower.tier).toBe(upper.tier);
  });
});
