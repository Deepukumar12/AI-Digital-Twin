const pdfParse = require('pdf-parse');
const DigitalTwin = require('../models/DigitalTwin');
const { extractResumeData } = require('../services/aiGateway');
const { 
  calculateSkillStrengthScore, 
  calculateCareerAlignment, 
  calculateTwinConfidenceIndex 
} = require('../services/analyticsService');
const { storeMemory } = require('../services/memoryService');

/**
 * POST /api/resume/upload
 * The core engine for analyzing resumes and building the Digital Twin.
 */
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    console.log(`[ResumeController] Processing upload for user: ${req.user.userId}`);

    // 1. Extract text using pdf-parse
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // 2. AI Extraction (Groq -> HF -> Local)
    const structuredData = await extractResumeData(text);

    // 3. Vector Memory Storage
    await storeMemory(req.user.userId, text, { type: 'resume_upload' });

    // 4. Perform Intelligence Analytics
    const skillStrengthScore = calculateSkillStrengthScore(structuredData.technical_skills);
    
    // Default target role to the first recommended role if not set
    const targetRole = structuredData.primary_domain || (structuredData.recommended_roles && structuredData.recommended_roles[0]) || 'Full Stack Developer';
    const alignmentPercentage = calculateCareerAlignment(structuredData.technical_skills, targetRole);
    
    const twinConfidenceIndex = calculateTwinConfidenceIndex(structuredData, structuredData.technical_skills, 0);

    // 5. Build/Update Digital Twin in MongoDB
    const twinData = {
      userId: req.user.userId,
      ...structuredData,
      target_role: targetRole,
      skill_strength_score: skillStrengthScore,
      alignment_percentage: alignmentPercentage,
      twin_confidence_index: twinConfidenceIndex,
      missing_skills: []
    };

    const twin = await DigitalTwin.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: twinData },
      { new: true, upsert: true }
    );

    console.log(`[ResumeController] Digital Twin ${twin._id} updated successfully.`);

    res.status(200).json({
      message: 'Intelligence Analysis Complete',
      twin
    });

  } catch (error) {
    console.error('[ResumeController] Critical Error:', error);
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
};