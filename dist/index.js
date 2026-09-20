/**
 * Smart Model Router
 * Skylily 🌸
 *
 * Intelligent LLM model router that analyzes task complexity
 * and routes to the optimal model. Save money, maintain quality.
 *
 * @packageDocumentation
 */
// Models
export { MODELS, MODEL_TIERS, getModelsByTier, getModelById, getCheapestModel, } from './models.js';
// Analyzer
export { analyzeTask, quickAnalyze, } from './analyzer.js';
// Router
export { SmartRouter, routeTask, defaultRouter, } from './router.js';
// Errors
export { SmartRouterError, InvalidTaskError, NoModelFoundError, InvalidModelError, InvalidTierError, InvalidConfigError, isSmartRouterError, getErrorMessage, } from './errors.js';
/**
 * Quick start example:
 *
 * @example
 * ```typescript
 * import { routeTask } from 'skylily-smart-router';
 *
 * // Simple task → cheap model
 * const result = routeTask("Write a hello world function in Python");
 * console.log(result.model.name);  // "GPT-4.1 Mini"
 * console.log(result.estimatedCost.totalCost);  // $0.000003
 *
 * // Complex task → powerful model
 * const complex = routeTask("Design a distributed consensus algorithm");
 * console.log(complex.model.name);  // "Claude Opus 4.5"
 * console.log(complex.analysis.tier);  // "ultra"
 * ```
 */
//# sourceMappingURL=index.js.map