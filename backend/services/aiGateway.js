/**
 * aiGateway.js
 * 
 * Central orchestration for all AI calls.
 * Layer 1: Groq API (llama3-70b-8192) - Primary
 * Layer 2: HuggingFace API (Mistral) - Fallback
 * Layer 3: Local Fallback
 */

const axios = require('axios');
const promptOptimizer = require('./promptOptimizer');

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Safely parse JSON from LLM outputs
 */
const parseJSONSafely = (text) => {
    try {
        // Strip markdown backticks
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Match the widest possible JSON structure (Object or Array)
        const startMatch = cleanText.match(/[\[\{]/);
        const endMatch = cleanText.match(/[\]\}](?=[^\]\}]*$)/);

        if (startMatch && endMatch) {
            cleanText = cleanText.substring(startMatch.index, endMatch.index + 1);
        }

        return JSON.parse(cleanText);
    } catch (err) {
        console.error('[AIGateway] JSON Parse Failed for text:', text.substring(0, 100) + '...');
        throw new Error('AI_JSON_PARSE_FAILED: Response was not valid JSON.');
    }
};

/**
 * Utility: Wait for ms
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Layer 1: Call Groq (Multi-Model Quota Rotation)
 */
const callGroq = async (systemInstruction, userPrompt, isJsonExpected = false) => {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_key')) {
        throw new Error("GROQ_API_KEY missing or invalid");
    }

    // Rotate across models to bypass 429 Limits (Groq tracks quotas per-model)
    const modelsToTry = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192",
        "mixtral-8x7b-32768"
    ];

    let lastError;
    for (const modelName of modelsToTry) {
        try {
            console.log(`[AIGateway] Trying Groq Model: ${modelName}...`);
            const response = await axios.post(
                GROQ_API,
                {
                    model: modelName,
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.1,
                    response_format: isJsonExpected ? { type: "json_object" } : undefined
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000
                }
            );

            const text = response.data.choices[0].message.content;
            return isJsonExpected ? parseJSONSafely(text) : text;
        } catch (err) {
            lastError = err;
            const status = err.response?.status;
            
            if (status === 429) {
                console.warn(`[AIGateway] Groq model ${modelName} hit rate limit (429). Instantly switching to next model...`);
                continue; // Instantly attempt the next model
            }
            
            if (status === 400 || status === 404 || status === 413) {
                 console.warn(`[AIGateway] Groq model ${modelName} is unavailable, syntax error, or payload too large (${status}). Switching...`);
                 continue;
            }

            console.warn(`[AIGateway] Groq model ${modelName} failed (${status || err.message}).`);
            break; // Break loop for severe errors (like 401 Unauthorized or network timeouts) to allow Gemini layer
        }
    }

    throw lastError; // if all fail, throw error to trigger Gemini fallback
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Layer 2: Call Google Gemini API (Multi-Model Quota Rotation)
 */
const callGemini = async (systemInstruction, userPrompt, isJsonExpected = false) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_key')) {
        throw new Error("GEMINI_API_KEY missing or invalid");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Quotas are explicitly tracked per-model. Rotating them bypasses 429 limits instantly.
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-1.5-pro-latest"];
    
    let lastError;
    for (const modelName of modelsToTry) {
        try {
            console.log(`[AIGateway] Trying Gemini Model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const combinedPrompt = `System/Context: ${systemInstruction}\n\nTask: ${userPrompt}`;
            const result = await model.generateContent(combinedPrompt);
            const text = result.response.text();

            return isJsonExpected ? parseJSONSafely(text) : text;
        } catch (err) {
            lastError = err;
            const status = err.response?.status || err.status;
            
            if (status === 429) {
                console.warn(`[AIGateway] Gemini model ${modelName} hit rate limit (429). Instantly switching to next model...`);
                continue; // Instantly attempt the next model in the list
            }
            
            // If it's a structural error (like 400 Bad Request), fail immediately to prevent cascading bad requests.
            if (status === 400) throw err;
            
            console.warn(`[AIGateway] Gemini model ${modelName} failed (${status || err.message}).`);
            continue; // Catch-all for API glitches
        }
    }
    
    throw lastError;
};

/**
 * Layer 4: Local Fallback (Static Parser)
 */
const localFallback = (type, rawText) => {
    console.error(`[AIGateway] AI ENGINE OFFLINE: Initializing Expert Heuristics for ${type}`);
    
    // For critical failures where we CAN provide a high-quality template
    if (type === 'rebuild') {
        const domain = (rawText.toLowerCase() || '');
        let steps = [
            { task: "Master Advanced Architecture Patterns", type: "Learn", priority: "High" },
            { task: "Build a High-Scale Production Case Study", type: "Build", priority: "High" },
            { task: "Target High-Growth Startups for Mid-Senior Roles", type: "Apply", priority: "Medium" }
        ];

        if (domain.includes('front')) {
            steps[0].task = "Master Advanced React Design Patterns & Performance Optimization";
        } else if (domain.includes('back')) {
            steps[0].task = "Master Distributed Systems & High-Concurrency Microservices";
        } else if (domain.includes('data')) {
            steps[0].task = "Master Large-Scale Data Engineering & ML Ops Pipelines";
        }

        return { roadmap: steps };
    }

    if (type === 'simulate') {
        return {
            prediction_text: "THE AI INTELLIGENCE ENGINE IS TEMPORARILY OFFLINE. BASED ON CURRENT MARKET STATISTICS: Adding this skill typically increases your alignment by 15-20% and can unlock paths to Senior Technical roles. We recommend proceeding with the learning journey immediately.",
            alignment_percentage: "+15%",
            projected_salary_impact_percentage: "+12%",
            new_roles_unlocked: ["Senior Engineer", "Lead Developer"]
        };
    }

    if (type === 'role_skills') {
        // Fallback to a safe base set if AI fails to define a new role
        return { requiredSkills: ["System Design", "Advanced Language Proficiency", "Cloud Infrastructure", "Database Management", "Security Best Practices", "Testing & QA", "CI/CD Pipelines"] };
    }

    if (['resume_extraction'].includes(type)) {
        throw new Error('AI_CRITICAL_FAILURE: Failed to extract resume data. Please wait 60s and re-upload.');
    }

    if (type === 'resource_discovery') {
        return {
            resources: [
                { title: `Learn ${rawText} - Search Google`, provider: "Search", type: "Manual", url: `https://www.google.com/search?q=learn+${encodeURIComponent(rawText)}` }
            ]
        };
    }

    return "The AI Intelligence engine is momentarily under high load. I can still answer basic questions, but advanced analytics are temporarily restricted.";
};

/**
 * Orchestrator: Tiered Fallback
 */
const executeAIAction = async (type, systemInstruction, userPrompt, isJsonExpected = false) => {
    // 1. Try Groq (Primary + Fast)
    try {
        console.log(`[AIGateway] Trying Layer 1 (Groq) for ${type}...`);
        return await callGroq(systemInstruction, userPrompt, isJsonExpected);
    } catch (err) {
        if (err.response?.status !== 429) {
            console.warn(`[AIGateway] Layer 1 (Groq) FAILED: ${err.message}`);
        } else {
            console.warn(`[AIGateway] Layer 1 (Groq) 429 Rate Limit. Bypassing to Gemini...`);
        }

        // 2. Try Google Gemini (Multi-Model Quota Rotation)
        try {
            console.log(`[AIGateway] Trying Layer 2 (Gemini Multi-Model) for ${type}...`);
            return await callGemini(systemInstruction, userPrompt, isJsonExpected);
        } catch (err2) {
            console.warn(`[AIGateway] Layer 2 (Gemini) EXHAUSTED ALL QUOTAS: ${err2.message}`);

            // 3. Final Local Fallback
            return localFallback(type, userPrompt);
        }
    }
};

/**
 * Interface: Extract Resume Data
 */
const extractResumeData = async (rawResumeText) => {
    const text = promptOptimizer.optimizeResumeText(rawResumeText);
    const system = "You are an AI Career Intelligence Engine. Extract structured data from resumes. Always return VALID JSON.";
    const prompt = `Analyze this resume and return JSON with keys: technical_skills (array of {name, level (MUST BE EXACTLY ONE OF: "Beginner", "Intermediate", "Advanced"), confidence}), soft_skills (array), primary_domain, recommended_roles (array), strengths (array), weaknesses (array), career_readiness_score (number 0-100).

Resume:
${text}`;

    return await executeAIAction('resume_extraction', system, prompt, true);
};

/**
 * Interface: Generate Chat Response
 */
const generateChatResponse = async (digitalTwin, history, userMsg) => {
    const system = `You are a Career Mentor AI. User Profile: ${JSON.stringify(digitalTwin)}. Be concise and actionable.`;
    const prompt = `History: ${JSON.stringify(history.slice(-5))}\nUser: ${userMsg}`;

    return await executeAIAction('chat', system, prompt, false);
};

/**
 * Interface: Discover Learning Resources
 */
const generateResources = async (skillOrTask, type = 'Learn') => {
    let focusInstruction = "Find 3 high-quality educational tutorials or courses.";
    let providerExamples = "Coursera, Udemy, Official Docs, YouTube";
    let typeExamples = "Course, Documentation, Video, Article";

    if (type === 'Build') {
        focusInstruction = "Find 3 high-quality project templates, code repositories, or sandbox environments.";
        providerExamples = "GitHub, CodePen, Replit, Vercel Templates";
        typeExamples = "Repository, Template, Sandbox, Starter Kit";
    } else if (type === 'Apply') {
        focusInstruction = "Find 3 highly relevant job boards or hiring portals.";
        providerExamples = "LinkedIn Jobs, Indeed, Glassdoor, Wellfound";
        typeExamples = "Job Board, Career Portal, Network";
    }

    const system = `You are a senior tech mentor providing Action Roadmap Links. When given a task, return EXACTLY ONE valid JSON object containing an array called 'resources'. Each resource must have 'title', 'provider' (e.g., ${providerExamples}), 'type' (${typeExamples}), and a real, commonly used 'url' to execute that exact task. NO MARKDOWN. NO CONVERSATIONAL TEXT.`;
    const prompt = `${focusInstruction} Task: "${skillOrTask}". Return ONLY JSON: {"resources": [{"title":"", "provider":"", "type":"", "url":""}]}`;

    return await executeAIAction('resource_discovery', system, prompt, true);
};

/**
 * Interface: Dynamically Generate Required Skills for Unknown Roles
 */
const generateRequiredSkills = async (targetRole) => {
    const system = "You are an AI Career Intelligence Engine. Your task is to accurately define the required core skills for specific job roles.";
    const prompt = `Return EXACTLY ONE valid JSON object defining the TOP 7 MOST CRITICAL technical skills or tools required for a "${targetRole}".
Format required: {"requiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7"]}`;

    try {
        const response = await executeAIAction('role_skills', system, prompt, true);
        return response.requiredSkills && Array.isArray(response.requiredSkills) ? response.requiredSkills : null;
    } catch (err) {
        console.error('[AIGateway] Failed to generate skills for role:', err.message);
        return null; // Let the caller fallback gracefully
    }
};

module.exports = {
    extractResumeData,
    generateChatResponse,
    generateResources,
    generateRequiredSkills,
    executeAIAction
};