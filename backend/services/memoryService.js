/**
 * memoryService.js
 * 
 * Vector Memory System using ChromaDB.
 * Stores resume embeddings and chat history for long-term semantic retrieval.
 */

const Memory = require('../models/Memory');

/**
 * Initialize Memory System (No-op for MongoDB as it initializes in app.js)
 */
const initMemory = async () => {
    console.log("[MemoryService] MongoDB Persistence Online. (Local ChromaDB bypassed for system safety)");
    return true;
};

/**
 * Store Memory Persistently in MongoDB
 */
const storeMemory = async (userId, data, metadata = {}) => {
    try {
        const docString = typeof data === 'string' ? data : JSON.stringify(data);
        
        await Memory.create({
            userId,
            document: docString,
            metadata,
            timestamp: Date.now()
        });
        
        console.log(`[MemoryService] Stored persistent entry for user: ${userId}`);
    } catch (err) {
        console.error("[MemoryService] Store Error:", err.message);
    }
};

/**
 * Query Memory using MongoDB Text Search
 */
const searchMemory = async (userId, queryText, limit = 3) => {
    try {
        // Use MongoDB's text search for semantic-like retrieval
        const results = await Memory.find(
            { 
                userId, 
                $text: { $search: queryText } 
            },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit);

        if (results.length > 0) {
            return results.map(r => r.document);
        }

        // Fallback to basic case-insensitive regex if text search yields no results
        const regexResults = await Memory.find({
            userId,
            document: { $regex: queryText.split(' ')[0], $options: 'i' }
        }).limit(limit);

        return regexResults.map(r => r.document);

    } catch (err) {
        console.error("[MemoryService] Search Error:", err.message);
        return [];
    }
};

module.exports = {
    initMemory,
    storeMemory,
    searchMemory
};
