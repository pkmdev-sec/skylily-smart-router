/**
 * Model Definitions with Costs and Capabilities
 * Smart Model Router - Skylily 🌸
 */
export const MODELS = {
    // ULTRA TIER - Deep reasoning, complex architecture
    'anthropic/claude-opus-4-5': {
        id: 'claude-opus-4-5',
        provider: 'anthropic',
        name: 'Claude Opus 4.5',
        tier: 'ultra',
        capabilities: ['reasoning', 'coding', 'analysis', 'writing', 'math', 'vision'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 15, outputPer1M: 75 },
        strengths: ['complex reasoning', 'nuanced analysis', 'creative writing', 'long context'],
        weaknesses: ['expensive', 'slower'],
        reasoning: true,
    },
    'openai/o3': {
        id: 'o3',
        provider: 'openai',
        name: 'o3',
        tier: 'ultra',
        capabilities: ['reasoning', 'math', 'coding', 'analysis'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 20, outputPer1M: 60 },
        strengths: ['mathematical reasoning', 'logic puzzles', 'complex problems'],
        weaknesses: ['expensive', 'slower', 'overkill for simple tasks'],
        reasoning: true,
    },
    // HEAVY TIER - Good for most complex tasks
    'anthropic/claude-sonnet-4-5': {
        id: 'claude-sonnet-4-5',
        provider: 'anthropic',
        name: 'Claude Sonnet 4.5',
        tier: 'heavy',
        capabilities: ['reasoning', 'coding', 'analysis', 'writing', 'vision'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 3, outputPer1M: 15 },
        strengths: ['balanced performance', 'good coding', 'reliable'],
        weaknesses: ['less creative than opus'],
        reasoning: true,
    },
    'google/gemini-2.5-pro': {
        id: 'gemini-2.5-pro',
        provider: 'google',
        name: 'Gemini 2.5 Pro',
        tier: 'heavy',
        capabilities: ['reasoning', 'coding', 'analysis', 'multimodal'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 2.5, outputPer1M: 10 },
        strengths: ['large context', 'multimodal', 'fast'],
        weaknesses: ['less reliable than claude'],
        reasoning: false,
    },
    'openai/gpt-5.2-codex': {
        id: 'gpt-5.2-codex',
        provider: 'openai',
        name: 'GPT-5.2 Codex',
        tier: 'heavy',
        capabilities: ['coding', 'analysis', 'refactoring'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 5, outputPer1M: 15 },
        strengths: ['excellent coding', 'fast iterations'],
        weaknesses: ['coding-focused'],
        reasoning: false,
    },
    // STANDARD TIER - Everyday tasks
    'openai/gpt-4.1': {
        id: 'gpt-4.1',
        provider: 'openai',
        name: 'GPT-4.1',
        tier: 'standard',
        capabilities: ['coding', 'analysis', 'writing'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 2, outputPer1M: 8 },
        strengths: ['reliable', 'fast', 'good coding'],
        weaknesses: ['not as creative'],
        reasoning: false,
    },
    'google/gemini-2.5-flash': {
        id: 'gemini-2.5-flash',
        provider: 'google',
        name: 'Gemini 2.5 Flash',
        tier: 'standard',
        capabilities: ['coding', 'analysis', 'quick tasks'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 0.5, outputPer1M: 1.5 },
        strengths: ['very fast', 'cheap', 'good enough for most'],
        weaknesses: ['less nuanced'],
        reasoning: false,
    },
    // LIGHT TIER - Quick tasks, simple queries
    'openai/gpt-4.1-mini': {
        id: 'gpt-4.1-mini',
        provider: 'openai',
        name: 'GPT-4.1 Mini',
        tier: 'light',
        capabilities: ['simple-coding', 'formatting', 'extraction', 'classification'],
        contextWindow: 200000,
        maxTokens: 8192,
        cost: { inputPer1M: 0.15, outputPer1M: 0.6 },
        strengths: ['very cheap', 'fast', 'good for simple tasks'],
        weaknesses: ['limited reasoning', 'simple only'],
        reasoning: false,
    },
    'anthropic/claude-haiku': {
        id: 'claude-haiku',
        provider: 'anthropic',
        name: 'Claude Haiku',
        tier: 'light',
        capabilities: ['simple-coding', 'formatting', 'extraction'],
        contextWindow: 200000,
        maxTokens: 4096,
        cost: { inputPer1M: 0.25, outputPer1M: 1.25 },
        strengths: ['fast', 'cheap', 'reliable for simple'],
        weaknesses: ['limited capability'],
        reasoning: false,
    },
    // NANO TIER - Trivial operations
    'openai/gpt-4.1-nano': {
        id: 'gpt-4.1-nano',
        provider: 'openai',
        name: 'GPT-4.1 Nano',
        tier: 'nano',
        capabilities: ['formatting', 'extraction', 'classification'],
        contextWindow: 128000,
        maxTokens: 4096,
        cost: { inputPer1M: 0.05, outputPer1M: 0.2 },
        strengths: ['extremely cheap', 'instant'],
        weaknesses: ['very limited'],
        reasoning: false,
    },
    'google/gemini-2.5-flash-lite': {
        id: 'gemini-2.5-flash-lite',
        provider: 'google',
        name: 'Gemini 2.5 Flash Lite',
        tier: 'nano',
        capabilities: ['formatting', 'extraction'],
        contextWindow: 128000,
        maxTokens: 4096,
        cost: { inputPer1M: 0.02, outputPer1M: 0.08 },
        strengths: ['cheapest', 'fastest'],
        weaknesses: ['minimal capability'],
        reasoning: false,
    },
};
export const MODEL_TIERS = ['ultra', 'heavy', 'standard', 'light', 'nano'];
export function getModelsByTier(tier) {
    return Object.values(MODELS).filter(m => m.tier === tier);
}
export function getModelById(id) {
    return Object.values(MODELS).find(m => m.id === id || `${m.provider}/${m.id}` === id);
}
export function getCheapestModel(tier) {
    const models = getModelsByTier(tier);
    return models.sort((a, b) => a.cost.outputPer1M - b.cost.outputPer1M)[0];
}
// Additional models
MODELS['perplexity/sonar-pro'] = {
    id: 'sonar-pro',
    provider: 'perplexity',
    name: 'Perplexity Sonar Pro',
    tier: 'heavy',
    capabilities: ['research', 'web-search', 'analysis', 'citations'],
    contextWindow: 200000,
    maxTokens: 8192,
    cost: { inputPer1M: 3, outputPer1M: 15 },
    strengths: ['real-time web search', 'citations', 'research'],
    weaknesses: ['not for coding', 'requires internet'],
    reasoning: false,
};
MODELS['deepseek/v3'] = {
    id: 'deepseek-v3',
    provider: 'deepseek',
    name: 'DeepSeek V3',
    tier: 'heavy',
    capabilities: ['coding', 'analysis', 'math'],
    contextWindow: 200000,
    maxTokens: 8192,
    cost: { inputPer1M: 0.27, outputPer1M: 1.1 },
    strengths: ['excellent coding', 'very cheap', 'fast'],
    weaknesses: ['less creative writing'],
    reasoning: false,
};
// Export pricing summary
export function getPricingSummary() {
    const lines = ['Model Pricing (per 1M tokens):', ''];
    for (const tier of MODEL_TIERS) {
        lines.push('=== ' + tier.toUpperCase() + ' ===');
        const models = getModelsByTier(tier).sort((a, b) => a.cost.outputPer1M - b.cost.outputPer1M);
        for (const m of models) {
            const name = m.name.padEnd(25);
            const input = '$' + m.cost.inputPer1M.toFixed(2);
            const output = '$' + m.cost.outputPer1M.toFixed(2);
            lines.push('  ' + name + ' ' + input + ' in / ' + output + ' out');
        }
        lines.push('');
    }
    return lines.join('\n');
}
//# sourceMappingURL=models.js.map