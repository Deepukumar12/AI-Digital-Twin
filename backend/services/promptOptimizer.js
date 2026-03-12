/**
 * promptOptimizer.js
 * 
 * Truncates and formats inputs (like long resumes) to ensure they fit 
 * within token limits and reduce latency / cost.
 */

// Max characters allowed for a resume before truncation
// Rough estimate: 1 token ~= 4 characters. 
// So 12,000 chars is roughly 3,000 tokens, well within Gemini/HF limits.
const MAX_RESUME_CHARS = 12000;

/**
 * Clean and truncate resume text to save tokens and prevent API errors.
 */
const optimizeResumeText = (text) => {
    if (!text) return "";
    
    // 1. Remove excessive whitespace, newlines, tabs
    let optimized = text
        .replace(/\s+/g, ' ')
        .replace(/[\n\r\t]+/g, ' ')
        .trim();

    // 2. Remove common unhelpful boilerplate (optional, minimal for safety)
    // E.g. "References available upon request", etc.
    optimized = optimized.replace(/references available upon request/ig, '');

    // 3. Truncate if it exceeds max length
    if (optimized.length > MAX_RESUME_CHARS) {
        // We truncate the *end* of the resume as it usually contains older, less relevant info
        optimized = optimized.substring(0, MAX_RESUME_CHARS);
        console.warn(`[PromptOptimizer] Resume text truncated from ${text.length} to ${MAX_RESUME_CHARS} characters.`);
    }

    return optimized;
};

/**
 * Format chat history to compress it and save tokens, keeping only recent context
 */
const optimizeChatHistory = (history, maxMessages = 10) => {
    if (!history || !Array.isArray(history)) return [];
    
    // Keep only the last `maxMessages`
    return history.slice(-maxMessages);
};

module.exports = {
    optimizeResumeText,
    optimizeChatHistory,
    MAX_RESUME_CHARS
};
