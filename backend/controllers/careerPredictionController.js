const DigitalTwin = require('../models/DigitalTwin');
const careerPredictionService = require('../services/careerPredictionService');

/**
 * POST /api/career/self-assessment
 * Receives the self-assessment sliders, calculates career path, and updates twin
 */
exports.submitAssessment = async (req, res) => {
    try {
        const { assessments } = req.body;
        const userId = req.user.userId;

        if (!assessments || !Array.isArray(assessments)) {
            return res.status(400).json({ error: 'Valid assessments array is required' });
        }

        // Engine Prediction
        const predictionResult = careerPredictionService.predictCareer(assessments);

        // Update Database
        const updatedTwin = await DigitalTwin.findOneAndUpdate(
            { userId: userId },
            {
                $set: {
                    skill_assessments: assessments,
                    career_predictions: predictionResult.career_scores,
                    recommended_career: predictionResult.recommended_career,
                    // Optionally overwrite or append missing_skills based on the new system constraint
                    missing_skills: predictionResult.missing_skills,
                    target_role: predictionResult.recommended_career // Set their target
                }
            },
            { new: true, upsert: true } // If twin doesn't fully exist somehow, though usually it does
        );

        res.json({
            message: `Based on your resume and subject knowledge, your best career path is ${predictionResult.recommended_career}.`,
            prediction: predictionResult,
            twin: updatedTwin
        });

    } catch (error) {
        console.error('[CareerPredictionController] Error submitting assessment:', error);
        res.status(500).json({ error: 'Failed to process career self-assessment' });
    }
};

/**
 * GET /api/career/recommendation
 * Fetches the current prediction state
 */
exports.getRecommendation = async (req, res) => {
    try {
        const twin = await DigitalTwin.findOne({ userId: req.user.userId });

        if (!twin) {
            return res.status(404).json({ error: 'Digital Twin not found' });
        }

        res.json({
            recommended_career: twin.recommended_career,
            career_predictions: twin.career_predictions,
            missing_skills: twin.missing_skills
        });

    } catch (error) {
        console.error('[CareerPredictionController] Error fetching recommendation:', error);
        res.status(500).json({ error: 'Failed to fetch career recommendation' });
    }
};
