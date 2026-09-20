/**
 * Custom Error Classes
 * Smart Model Router - Skylily 🌸
 * 
 * Provides descriptive, actionable error messages.
 */

/**
 * Base error class for Smart Router errors
 */
export class SmartRouterError extends Error {
  public readonly code: string;
  public readonly suggestion?: string;

  constructor(message: string, code: string, suggestion?: string) {
    super(message);
    this.name = 'SmartRouterError';
    this.code = code;
    this.suggestion = suggestion;
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get a formatted error message with suggestion
   */
  toFormattedString(): string {
    let result = `[${this.code}] ${this.message}`;
    if (this.suggestion) {
      result += `\n💡 Suggestion: ${this.suggestion}`;
    }
    return result;
  }
}

/**
 * Error thrown when task text is invalid
 */
export class InvalidTaskError extends SmartRouterError {
  constructor(reason: string) {
    super(
      `Invalid task: ${reason}`,
      'INVALID_TASK',
      'Provide a non-empty string describing the task you want to route.'
    );
    this.name = 'InvalidTaskError';
  }
}

/**
 * Error thrown when no suitable model can be found
 */
export class NoModelFoundError extends SmartRouterError {
  public readonly constraints: Record<string, unknown>;

  constructor(constraints: Record<string, unknown>) {
    const constraintStr = Object.entries(constraints)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(', ');
    
    super(
      `No model found matching constraints: ${constraintStr}`,
      'NO_MODEL_FOUND',
      'Try relaxing constraints (remove provider preference, increase maxCostPer1M, or remove capability requirements).'
    );
    this.name = 'NoModelFoundError';
    this.constraints = constraints;
  }
}

/**
 * Error thrown when a model ID is invalid
 */
export class InvalidModelError extends SmartRouterError {
  public readonly modelId: string;

  constructor(modelId: string) {
    super(
      `Model not found: "${modelId}"`,
      'INVALID_MODEL',
      'Use getModelsByTier() or MODELS to see available model IDs.'
    );
    this.name = 'InvalidModelError';
    this.modelId = modelId;
  }
}

/**
 * Error thrown when a tier is invalid
 */
export class InvalidTierError extends SmartRouterError {
  public readonly tier: string;
  public readonly validTiers = ['nano', 'light', 'standard', 'heavy', 'ultra'];

  constructor(tier: string) {
    super(
      `Invalid tier: "${tier}"`,
      'INVALID_TIER',
      `Valid tiers are: ${['nano', 'light', 'standard', 'heavy', 'ultra'].join(', ')}`
    );
    this.name = 'InvalidTierError';
    this.tier = tier;
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class InvalidConfigError extends SmartRouterError {
  public readonly field: string;

  constructor(field: string, reason: string) {
    super(
      `Invalid configuration for "${field}": ${reason}`,
      'INVALID_CONFIG',
      'Check the RouterConfig type for valid configuration options.'
    );
    this.name = 'InvalidConfigError';
    this.field = field;
  }
}

/**
 * Type guard to check if an error is a SmartRouterError
 */
export function isSmartRouterError(error: unknown): error is SmartRouterError {
  return error instanceof SmartRouterError;
}

/**
 * Safely get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}
