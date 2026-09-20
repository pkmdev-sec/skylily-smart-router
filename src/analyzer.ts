/**
 * Task Complexity Analyzer
 * Smart Model Router - Skylily 🌸
 * 
 * Analyzes task text to determine optimal model tier.
 * FIXED: Higher complexity signals now win over lower ones.
 */

import { ModelTier } from './models.js';

export interface TaskAnalysis {
  tier: ModelTier;
  confidence: number;
  signals: string[];
  reasoning: string;
  suggestedCapabilities: string[];
}

// Complexity signals for each tier (highest to lowest)
const ULTRA_SIGNALS = [
  /multi-?step.*(reasoning|analysis)/i,
  /complex.*architecture/i,
  /design.*system/i,
  /analyze.*trade-?offs/i,
  /strategic.*planning/i,
  /research.*paper/i,
  /mathematical.*proof/i,
  /distributed.*system/i,
  /compiler|interpreter/i,
  /refactor.*entire/i,
  /architect/i,
];

const HEAVY_SIGNALS = [
  /implement.*feature/i,
  /build.*(component|api|service|app)/i,
  /create.*(api|service|app|project)/i,
  /write.*(tests|code|function)/i,
  /debug|fix.*bug/i,
  /review.*code/i,
  /analyze.*(code|data)/i,
  /explain.*(concept|how|why)/i,
  /integration/i,
  /TypeScript|JavaScript|Python|Rust|Go\b/i,
];

const STANDARD_SIGNALS = [
  /add.*(function|method|endpoint)/i,
  /update.*(config|settings)/i,
  /generate.*(code|template)/i,
  /what.*(is|are|does)/i,
  /how.*(do|to|can)/i,
  /list|suggest/i,
  /simple|quick|basic/i,
];

const LIGHT_SIGNALS = [
  /format.*(json|text)/i,
  /extract|parse/i,
  /categorize|classify|tag/i,
  /translate.*(short|word)/i,
];

const NANO_SIGNALS = [
  /^(yes|no)\??$/i,
  /^is\s+\w+\s*\??$/i,
  /capitalize|lowercase|uppercase/i,
  /count.*(words|chars)/i,
  /echo|repeat/i,
];

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function countSignals(text: string, patterns: RegExp[]): { count: number; matches: string[] } {
  const matches: string[] = [];
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      matches.push(pattern.source.slice(0, 30));
    }
  }
  return { count: matches.length, matches };
}

export function analyzeTask(taskText: string): TaskAnalysis {
  const tokens = estimateTokens(taskText);
  const signals: string[] = [`tokens: ${tokens}`];
  
  // Check signals from HIGHEST to LOWEST tier
  // First match wins - no overriding by lower tiers
  const ultraMatch = countSignals(taskText, ULTRA_SIGNALS);
  const heavyMatch = countSignals(taskText, HEAVY_SIGNALS);
  const standardMatch = countSignals(taskText, STANDARD_SIGNALS);
  const lightMatch = countSignals(taskText, LIGHT_SIGNALS);
  const nanoMatch = countSignals(taskText, NANO_SIGNALS);
  
  let tier: ModelTier;
  let confidence: number;
  
  // Priority: ULTRA > HEAVY > STANDARD > LIGHT > NANO
  // Higher complexity signals WIN
  if (ultraMatch.count > 0) {
    tier = 'ultra';
    confidence = 0.85;
    signals.push(...ultraMatch.matches.map(m => `ultra: ${m}`));
  } else if (heavyMatch.count > 0) {
    tier = 'heavy';
    confidence = 0.80;
    signals.push(...heavyMatch.matches.map(m => `heavy: ${m}`));
  } else if (standardMatch.count > 0) {
    tier = 'standard';
    confidence = 0.75;
    signals.push(...standardMatch.matches.map(m => `standard: ${m}`));
  } else if (lightMatch.count > 0) {
    tier = 'light';
    confidence = 0.70;
    signals.push(...lightMatch.matches.map(m => `light: ${m}`));
  } else if (nanoMatch.count > 0) {
    tier = 'nano';
    confidence = 0.65;
    signals.push(...nanoMatch.matches.map(m => `nano: ${m}`));
  } else {
    // No signals matched - use token count
    if (tokens > 2000) tier = 'heavy';
    else if (tokens > 500) tier = 'standard';
    else if (tokens > 100) tier = 'light';
    else tier = 'nano';
    confidence = 0.50;
    signals.push('no pattern match, using token count');
  }
  
  // Capabilities
  const suggestedCapabilities: string[] = [];
  if (/code|function|class|api|typescript|javascript/i.test(taskText)) {
    suggestedCapabilities.push('coding');
  }
  if (/reason|analyze|think|evaluate/i.test(taskText)) {
    suggestedCapabilities.push('reasoning');
  }
  
  return {
    tier,
    confidence,
    signals,
    reasoning: `Task complexity: ${tier} | Confidence: ${Math.round(confidence * 100)}% | Signals: ${signals.length}`,
    suggestedCapabilities,
  };
}

export function quickAnalyze(taskText: string): ModelTier {
  return analyzeTask(taskText).tier;
}
