const DigitalTwin = require('../models/DigitalTwin');
const { executeAIAction, generateResources, generateRequiredSkills } = require('../services/aiGateway');
const jobMarketService = require('../services/jobMarketService');
const {
    calculateSkillStrengthScore,
    calculateCareerAlignment,
    detectSkillGaps,
    calculateTwinConfidenceIndex,
    ROLE_DATASET
} = require('../services/analyticsService');

/**
 * GET /api/twin
 * Retrieves the current user's digital twin
 */
exports.getTwin = async (req, res) => {
    try {
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });
        if (!twin) return res.status(404).json({ message: 'No digital twin found. Upload resume first.' });
        res.json({ twin });
    } catch (err) {
        console.error('[TwinController] Get Twin Error:', err);
        res.status(500).json({ message: 'Failed to retrieve twin', error: err.message });
    }
};

/**
 * Re-Run AI Assessment (Career Reconstruction)
 * POST /api/career/rebuild
 */
exports.rebuildTwin = async (req, res) => {
    try {
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });
        if (!twin) return res.status(404).json({ message: 'No digital twin found. Upload resume first.' });

        console.log(`[TwinController] Rebuilding twin for user: ${req.user.userId}`);
        
        const targetRoleParams = twin.target_role || twin.primary_domain;

        // 1. Fetch High-Precision Job Market Trends (Adzuna)
        const trends = await jobMarketService.getInsightsByRole(targetRoleParams, 'in'); // Defaulting to India for precision, can be expanded to user settings later.

        // 2. Ask AI to look at current profile + market trends and suggest a highly optimized career roadmap
        const system = "You are an AI Career Architect. Build a 3-step actionable roadmap.";
        const prompt = `Profile: ${JSON.stringify(twin)}\nMarket Trends: ${JSON.stringify(trends)}\nProvide JSON: roadmap (array of {task, type (MUST BE EXACTLY ONE OF: "Learn", "Build", "Apply", "Other"), priority})`;

        const aiReconstruction = await executeAIAction('rebuild', system, prompt, true);

        // 3. Recalculate Scores
        let dynamicSkills = null;
        if (!ROLE_DATASET[twin.target_role]) {
            console.log(`[TwinController] Target role '${twin.target_role}' not in hardcoded DB. Fetching via AI...`);
            dynamicSkills = await generateRequiredSkills(twin.target_role);
        }

        const skillStrength = calculateSkillStrengthScore(twin.technical_skills);
        const alignment = calculateCareerAlignment(twin.technical_skills, twin.target_role, dynamicSkills);
        const gaps = detectSkillGaps(twin.technical_skills, twin.target_role, dynamicSkills);
        const index = calculateTwinConfidenceIndex(twin, twin.technical_skills, 5); // Assume some history

        // 4. Update Twin
        await DigitalTwin.updateOne(
            { _id: twin._id },
            {
                $set: {
                    roadmap: aiReconstruction.roadmap || [],
                    skill_strength_score: skillStrength,
                    alignment_percentage: alignment,
                    missing_skills: gaps,
                    twin_confidence_index: index
                }
            }
        );

        const updatedTwin = await DigitalTwin.findById(twin._id);

        res.json({ message: 'Career Reconstruction Complete', twin: updatedTwin, trends });
    } catch (err) {
        console.error('[TwinController] Rebuild Error:', err);
        res.status(500).json({ message: 'Failed to rebuild twin', error: err.message });
    }
};

/**
 * Simulate Future Scenarios
 * POST /api/simulate
 */
exports.simulateScenario = async (req, res) => {
    try {
        const { scenario } = req.body; // e.g., "What happens if I learn Docker and AWS?"
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });
        if (!twin) return res.status(404).json({ message: 'Twin not found' });

        const system = `You are an expert Career Simulator AI built strictly for this AI Digital Twin platform. You MUST analyze the user's current Digital Twin profile and predict the realistic impact of a hypothetical scenario on their SPECIFIC target role. Do NOT hallucinate generic career advice. Base your entire analysis ONLY on their existing skills, missing skills, and target role metrics.

RESPOND ONLY WITH VALID JSON using EXACTLY the following format:
{
  "prediction_text": "A detailed, brutally honest, 2-3 paragraph analysis. Focus purely on their alignment shift and salary potential. Do NOT use markdown asterisks (**) or hashes (#). Use normal text formatting with dashes (-) for lists and ALL CAPS for headers.",
  "alignment_percentage": "+X% or -X%",
  "projected_salary_impact_percentage": "+X% or -X%",
  "new_roles_unlocked": ["Role 1", "Role 2", "None"]
}`;
        const prompt = `STRICT constraints: Ensure your analysis directly connects the user's scenario to their current stated Target Role: [${twin.target_role || twin.primary_domain}].\n\nCurrent Profile Data: ${JSON.stringify({
            skills: twin.technical_skills,
            missing: twin.missing_skills,
            target: twin.target_role,
            alignment: twin.alignment_percentage
        })}\n\nUser Scenario: "${scenario}"\n\nPredict the impact on their specific target role cleanly as JSON.`;

        // Requesting standard JSON instead of plain text
        const aiResponse = await executeAIAction('simulate', system, prompt, true);

        // Fallback parameter parsing 
        const predictionData = typeof aiResponse === 'object' ? aiResponse : JSON.parse(aiResponse);

        res.json({ success: true, prediction: predictionData });
    } catch (err) {
        res.status(500).json({ error: 'Simulation failed' });
    }
};

/**
 * Update Skill Management
 * POST /api/skills/add
 */
exports.addSkill = async (req, res) => {
    try {
        const { skill, level } = req.body;
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });

        // Add or update
        const existingIdx = twin.technical_skills.findIndex(s => s.name.toLowerCase() === skill.toLowerCase());
        if (existingIdx > -1) {
            twin.technical_skills[existingIdx].level = level;
        } else {
            twin.technical_skills.push({ name: skill, level, confidence: 90 });
        }

        // Recalculate
        let dynamicSkills = null;
        if (!ROLE_DATASET[twin.target_role]) {
            dynamicSkills = await generateRequiredSkills(twin.target_role);
        }

        twin.skill_strength_score = calculateSkillStrengthScore(twin.technical_skills);
        twin.alignment_percentage = calculateCareerAlignment(twin.technical_skills, twin.target_role, dynamicSkills);
        twin.missing_skills = detectSkillGaps(twin.technical_skills, twin.target_role, dynamicSkills);

        await twin.save();
        res.json({ success: true, twin });
    } catch (err) {
        res.status(500).json({ error: 'Skill update failed' });
    }
};

/**
 * POST /api/skills/remove
 */
exports.removeSkill = async (req, res) => {
    try {
        const { skill } = req.body;
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });
        twin.technical_skills = twin.technical_skills.filter(s => s.name.toLowerCase() !== skill.toLowerCase());

        let dynamicSkills = null;
        if (!ROLE_DATASET[twin.target_role]) {
            dynamicSkills = await generateRequiredSkills(twin.target_role);
        }

        twin.skill_strength_score = calculateSkillStrengthScore(twin.technical_skills);
        twin.alignment_percentage = calculateCareerAlignment(twin.technical_skills, twin.target_role, dynamicSkills);
        twin.missing_skills = detectSkillGaps(twin.technical_skills, twin.target_role, dynamicSkills);

        await twin.save();
        res.json({ success: true, twin });
    } catch (err) {
        res.status(500).json({ error: 'Skill removal failed' });
    }
};

/**
 * Update Target Role and Recalculate Alignment
 * POST /api/target/update
 */
exports.updateTargetRole = async (req, res) => {
    try {
        const { targetRole } = req.body;
        if (!targetRole) {
            return res.status(400).json({ error: 'Target role is required' });
        }

        const twin = await DigitalTwin.findOne({ userId: req.user.userId });
        if (!twin) return res.status(404).json({ message: 'Twin not found' });

        twin.target_role = targetRole;

        // Recalculate dynamic scores based on the new target
        let dynamicSkills = null;
        if (!ROLE_DATASET[twin.target_role]) {
            dynamicSkills = await generateRequiredSkills(twin.target_role);
        }

        twin.skill_strength_score = calculateSkillStrengthScore(twin.technical_skills);
        twin.alignment_percentage = calculateCareerAlignment(twin.technical_skills, twin.target_role, dynamicSkills);
        twin.missing_skills = detectSkillGaps(twin.technical_skills, twin.target_role, dynamicSkills);

        await twin.save();

        res.json({ success: true, message: `Target updated to ${targetRole}`, twin });
    } catch (err) {
        console.error('[TwinController] Target Update Error:', err);
        res.status(500).json({ error: 'Failed to update target role' });
    }
};

/**
 * AI Dynamic Resource Discovery
 * GET /api/resources?skill=xyz
 */
exports.generateLearningLinks = async (req, res) => {
    try {
        const { skill, type } = req.query;
        if (!skill) return res.status(400).json({ error: 'Skill or Task parameter required' });

        const result = await generateResources(skill, type);
        res.json(result);
    } catch (err) {
        console.error('[TwinController] Resource Generation Error:', err);
        res.status(500).json({ error: 'Failed to generate resources', resources: [] });
    }
};

/**
 * Report Generation (Mock for PDF/CSV triggers)
 * GET /api/report/pdf
 */
exports.generateReport = async (req, res) => {
    // In a real prod env, use puppeteer or jsPDF on backend. 
    // Here we return a clean data structure for the frontend to print.
    const twin = await DigitalTwin.findOne({ userId: req.user.userId });
    res.json({ reportData: twin, timestamp: new Date() });
};

/**
 * Reset Profile
 * POST /api/career/reset
 */
exports.resetTwin = async (req, res) => {
    try {
        await DigitalTwin.deleteOne({ userId: req.user.userId });
        res.json({ success: true, message: 'Digital Twin wiped successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Reset failed' });
    }
};
