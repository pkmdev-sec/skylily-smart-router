/**
 * Model Definitions with Costs and Capabilities
 * Smart Model Router - Skylily 🌸
 */
export interface ModelDefinition {
    id: string;
    provider: string;
    name: string;
    tier: 'ultra' | 'heavy' | 'standard' | 'light' | 'nano';
    capabilities: string[];
    contextWindow: number;
    maxTokens: number;
    cost: {
        inputPer1M: number;
        outputPer1M: number;
        cacheReadPer1M?: number;
        cacheWritePer1M?: number;
    };
    strengths: string[];
    weaknesses: string[];
    reasoning: boolean;
}
export declare const MODELS: Record<string, ModelDefinition>;
export declare const MODEL_TIERS: readonly ["ultra", "heavy", "standard", "light", "nano"];
export type ModelTier = typeof MODEL_TIERS[number];
export declare function getModelsByTier(tier: ModelTier): ModelDefinition[];
export declare function getModelById(id: string): ModelDefinition | undefined;
export declare function getCheapestModel(tier: ModelTier): ModelDefinition | undefined;
export declare function getPricingSummary(): string;
//# sourceMappingURL=models.d.ts.map