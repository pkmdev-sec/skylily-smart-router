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
export declare function analyzeTask(taskText: string): TaskAnalysis;
export declare function quickAnalyze(taskText: string): ModelTier;
//# sourceMappingURL=analyzer.d.ts.map