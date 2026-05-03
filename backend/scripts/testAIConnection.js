/**
 * testAIConnection.js
 * 
 * Simple script to verify Groq and Gemini connectivity.
 */
require('dotenv').config({ path: './backend/.env' });
const { executeAIAction } = require('../services/aiGateway');

async function test() {
    console.log("--- Starting AI Connectivity Test ---");
    console.log("GROQ_API_KEY check:", process.env.GROQ_API_KEY ? "EXISTS (starts with " + process.env.GROQ_API_KEY.substring(0, 4) + ")" : "MISSING");
    console.log("GEMINI_API_KEY check:", process.env.GEMINI_API_KEY ? "EXISTS (starts with " + process.env.GEMINI_API_KEY.substring(0, 4) + ")" : "MISSING");

    const system = "You are a test assistant.";
    const prompt = "Respond with 'Connected' if you can hear me.";

    console.log("\n[TEST] Testing Resume Extraction Fallback Layer...");
    try {
        const response = await executeAIAction('resume_extraction', system, prompt, true);
        console.log("\n[SUCCESS] Fallback Structured Data:", JSON.stringify(response, null, 2));
    } catch (err) {
        console.error("\n[FAILURE] AI Test Failed!");
        console.error("Error Message:", err.message);
        if (err.response) {
            console.error("Status Code:", err.response.status);
            console.error("Status Text:", err.response.statusText);
        }
    }
    console.log("\n--- Test Complete ---");
}

test();
