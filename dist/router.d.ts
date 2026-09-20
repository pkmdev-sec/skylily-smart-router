/**
 * Smart Model Router
 * Skylily 🌸
 *
 * Routes tasks to optimal models based on complexity analysis.
 */
import { ModelDefinition, ModelTier } from './models.js';
import { TaskAnalysis } from './analyzer.js';
export interface RouterConfig {
    defaultTier?: ModelTier;
    preferProvider?: string;
    maxCostPer1M?: number;
    requireCapabilities?: string[];
    fallbackModel?: string;
}
export interface RoutingResult {
    model: ModelDefinition;
    analysis: TaskAnalysis;
    alternatives: ModelDefinition[];
    estimatedCost: {
        inputTokens: number;
        outputTokens: number;
        totalCost: number;
    };
    reason: string;
}
export declare class SmartRouter {
    private config;
    private usageHistory;
    constructor(config?: RouterConfig);
    /**
     * Route a task to the optimal model
     */
    route(taskText: string, estimatedOutputTokens?: number): RoutingResult;
    /**
     * Estimate cost for a model and token counts
     */
    estimateCost(model: ModelDefinition, inputTokens: number, outputTokens: number): {
        inputTokens: number;
        outputTokens: number;
        totalCost: number;
    };
    /**
     * Generate human-readable reason for model selection
     */
    private generateReason;
    /**
     * Record usage for learning (future improvement)
     */
    recordUsage(modelId: string, task: string, success: boolean, cost: number): void;
    /**
     * Get usage statistics
     */
    getStats(): {
        totalRequests: number;
        successRate: number;
        totalCost: number;
        modelBreakdown: Record<string, {
            count: number;
            successRate: number;
            cost: number;
        }>;
    };
}
export declare function routeTask(taskText: string, config?: RouterConfig): RoutingResult;
export declare const defaultRouter: SmartRouter;
//# sourceMappingURL=router.d.ts.map