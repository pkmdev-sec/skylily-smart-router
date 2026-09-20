/**
 * Custom Error Classes
 * Smart Model Router - Skylily 🌸
 *
 * Provides descriptive, actionable error messages.
 */
/**
 * Base error class for Smart Router errors
 */
export declare class SmartRouterError extends Error {
    readonly code: string;
    readonly suggestion?: string;
    constructor(message: string, code: string, suggestion?: string);
    /**
     * Get a formatted error message with suggestion
     */
    toFormattedString(): string;
}
/**
 * Error thrown when task text is invalid
 */
export declare class InvalidTaskError extends SmartRouterError {
    constructor(reason: string);
}
/**
 * Error thrown when no suitable model can be found
 */
export declare class NoModelFoundError extends SmartRouterError {
    readonly constraints: Record<string, unknown>;
    constructor(constraints: Record<string, unknown>);
}
/**
 * Error thrown when a model ID is invalid
 */
export declare class InvalidModelError extends SmartRouterError {
    readonly modelId: string;
    constructor(modelId: string);
}
/**
 * Error thrown when a tier is invalid
 */
export declare class InvalidTierError extends SmartRouterError {
    readonly tier: string;
    readonly validTiers: string[];
    constructor(tier: string);
}
/**
 * Error thrown when configuration is invalid
 */
export declare class InvalidConfigError extends SmartRouterError {
    readonly field: string;
    constructor(field: string, reason: string);
}
/**
 * Type guard to check if an error is a SmartRouterError
 */
export declare function isSmartRouterError(error: unknown): error is SmartRouterError;
/**
 * Safely get error message from unknown error
 */
export declare function getErrorMessage(error: unknown): string;
//# sourceMappingURL=errors.d.ts.map