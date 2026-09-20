/**
 * Smart Model Router
 * Skylily 🌸
 * 
 * Routes tasks to optimal models based on complexity analysis.
 */

import { ModelDefinition, MODELS, ModelTier, getCheapestModel, getModelsByTier } from './models.js';
import { analyzeTask, TaskAnalysis } from './analyzer.js';

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

export class SmartRouter {
  private config: RouterConfig;
  private usageHistory: Array<{
    model: string;
    task: string;
    success: boolean;
    cost: number;
    timestamp: number;
  }> = [];

  constructor(config: RouterConfig = {}) {
    this.config = {
      defaultTier: 'standard',
      ...config,
    };
  }

  /**
   * Route a task to the optimal model
   */
  route(taskText: string, estimatedOutputTokens: number = 500): RoutingResult {
    // Analyze the task
    const analysis = analyzeTask(taskText);
    
    // Get candidate models for the tier
    let candidates = getModelsByTier(analysis.tier);
    
    // Filter by provider preference
    if (this.config.preferProvider) {
      const preferred = candidates.filter(m => m.provider === this.config.preferProvider);
      if (preferred.length > 0) {
        candidates = preferred;
      }
    }
    
    // Filter by required capabilities
    if (this.config.requireCapabilities && this.config.requireCapabilities.length > 0) {
      const required = this.config.requireCapabilities;
      candidates = candidates.filter(m => 
        required.every(cap => m.capabilities.includes(cap))
      );
    }
    
    // Filter by max cost
    if (this.config.maxCostPer1M) {
      candidates = candidates.filter(m => 
        m.cost.outputPer1M <= this.config.maxCostPer1M!
      );
    }
    
    // If no candidates, fall back
    if (candidates.length === 0) {
      // Try one tier up
      const tierIndex = ['nano', 'light', 'standard', 'heavy', 'ultra'].indexOf(analysis.tier);
      if (tierIndex < 4) {
        const higherTier = ['nano', 'light', 'standard', 'heavy', 'ultra'][tierIndex + 1] as ModelTier;
        candidates = getModelsByTier(higherTier);
      }
      
      // Still no candidates? Use fallback or default
      if (candidates.length === 0) {
        if (this.config.fallbackModel) {
          const fallback = Object.values(MODELS).find(m => 
            m.id === this.config.fallbackModel || `${m.provider}/${m.id}` === this.config.fallbackModel
          );
          if (fallback) {
            candidates = [fallback];
          }
        }
        
        // Last resort: use standard tier
        if (candidates.length === 0) {
          candidates = getModelsByTier('standard');
        }
      }
    }
    
    // Sort by cost (cheapest first)
    candidates.sort((a, b) => a.cost.outputPer1M - b.cost.outputPer1M);
    
    // Select the best (cheapest that fits)
    const selected = candidates[0];
    const alternatives = candidates.slice(1, 4);
    
    // Estimate cost
    const inputTokens = Math.ceil(taskText.length / 4);
    const estimatedCost = this.estimateCost(selected, inputTokens, estimatedOutputTokens);
    
    return {
      model: selected,
      analysis,
      alternatives,
      estimatedCost,
      reason: this.generateReason(selected, analysis),
    };
  }

  /**
   * Estimate cost for a model and token counts
   */
  estimateCost(model: ModelDefinition, inputTokens: number, outputTokens: number): {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  } {
    const inputCost = (inputTokens / 1_000_000) * model.cost.inputPer1M;
    const outputCost = (outputTokens / 1_000_000) * model.cost.outputPer1M;
    return {
      inputTokens,
      outputTokens,
      totalCost: inputCost + outputCost,
    };
  }

  /**
   * Generate human-readable reason for model selection
   */
  private generateReason(model: ModelDefinition, analysis: TaskAnalysis): string {
    const reasons: string[] = [];
    
    reasons.push(`Task complexity: ${analysis.tier}`);
    
    if (analysis.suggestedCapabilities.length > 0) {
      reasons.push(`Requires: ${analysis.suggestedCapabilities.join(', ')}`);
    }
    
    reasons.push(`Selected: ${model.name} (${model.provider})`);
    reasons.push(`Cost: $${model.cost.outputPer1M}/1M output tokens`);
    
    if (model.strengths.length > 0) {
      reasons.push(`Strengths: ${model.strengths.slice(0, 2).join(', ')}`);
    }
    
    return reasons.join(' | ');
  }

  /**
   * Record usage for learning (future improvement)
   */
  recordUsage(modelId: string, task: string, success: boolean, cost: number): void {
    this.usageHistory.push({
      model: modelId,
      task: task.slice(0, 100),
      success,
      cost,
      timestamp: Date.now(),
    });
    
    // Keep last 1000 entries
    if (this.usageHistory.length > 1000) {
      this.usageHistory = this.usageHistory.slice(-1000);
    }
  }

  /**
   * Get usage statistics
   */
  getStats(): {
    totalRequests: number;
    successRate: number;
    totalCost: number;
    modelBreakdown: Record<string, { count: number; successRate: number; cost: number }>;
  } {
    const stats = {
      totalRequests: this.usageHistory.length,
      successRate: 0,
      totalCost: 0,
      modelBreakdown: {} as Record<string, { count: number; successRate: number; cost: number }>,
    };
    
    if (this.usageHistory.length === 0) return stats;
    
    let successCount = 0;
    
    for (const entry of this.usageHistory) {
      if (entry.success) successCount++;
      stats.totalCost += entry.cost;
      
      if (!stats.modelBreakdown[entry.model]) {
        stats.modelBreakdown[entry.model] = { count: 0, successRate: 0, cost: 0 };
      }
      stats.modelBreakdown[entry.model].count++;
      stats.modelBreakdown[entry.model].cost += entry.cost;
      if (entry.success) {
        stats.modelBreakdown[entry.model].successRate++;
      }
    }
    
    stats.successRate = successCount / stats.totalRequests;
    
    // Convert success counts to rates
    for (const model in stats.modelBreakdown) {
      const m = stats.modelBreakdown[model];
      m.successRate = m.count > 0 ? m.successRate / m.count : 0;
    }
    
    return stats;
  }
}

// Convenience function for quick routing
export function routeTask(taskText: string, config?: RouterConfig): RoutingResult {
  const router = new SmartRouter(config);
  return router.route(taskText);
}

// Export singleton for simple use
export const defaultRouter = new SmartRouter();
