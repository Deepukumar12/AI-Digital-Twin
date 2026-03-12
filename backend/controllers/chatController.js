const DigitalTwin = require('../models/DigitalTwin');
const { generateChatResponse } = require('../services/aiGateway');
const { searchMemory, storeMemory } = require('../services/memoryService');

/**
 * POST /api/chat
 * AI Career Mentor with Long-Term Memory
 */
exports.careerMentorChat = async (req, res) => {
    try {
        const { message } = req.body;
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });
        
        // 1. Retrieve Semantic Context from Memory
        const relevantContext = await searchMemory(req.user.userId, message);

        // 2. Mock history (Production would use a Chat/Message model)
        const history = [
            { role: 'system', content: `Context from memory: ${JSON.stringify(relevantContext)}` },
            { role: 'user', content: message }
        ];

        // 3. Generate AI Response
        const response = await generateChatResponse(twin, history, message);

        // 4. Store interaction in Vector Memory
        await storeMemory(req.user.userId, `User Asked: ${message}\nAI Responded: ${response}`, { type: 'chat_history' });

        res.json({ success: true, response });
    } catch (err) {
        console.error('[ChatController] Error:', err);
        res.status(500).json({ error: 'Career Coach is busy. Try again later.' });
    }
};
