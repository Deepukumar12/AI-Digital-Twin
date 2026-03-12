/**
 * Dataset defining required subjects for each career path
 */
const CAREER_SKILL_DATASET = {
    'Full Stack Developer': [
        'DSA', 'JavaScript', 'React', 'Node.js', 'Database', 'System Design'
    ],
    'Backend Developer': [
        'DSA', 'Node.js', 'Express', 'Database', 'System Design'
    ],
    'AI Engineer': [
        'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Math'
    ],
    'Data Scientist': [
        'Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'Linear Algebra'
    ]
};

/**
 * Service to calculate career suitability based on user self-assessment
 */
class CareerPredictionService {

    /**
     * Calculate scores for all careers based on assessment
     * Formula: CareerScore = (sum of skill values for required skills) / total required skills
     * 
     * @param {Array<{subject: string, score: number}>} userAssessments 
     * @returns {Object} { recommended_career, career_scores, missing_skills }
     */
    predictCareer(userAssessments) {
        // Convert array to quick lookup map and calculate average of their actual skills
        let totalAssessedScore = 0;
        let numAssessed = 0;
        const assessmentMap = {};

        userAssessments.forEach(item => {
            const score = item.score || 0;
            assessmentMap[item.subject.toLowerCase()] = score;
            totalAssessedScore += score;
            numAssessed++;
        });

        const averageUserScore = numAssessed > 0 ? Math.round(totalAssessedScore / numAssessed) : 50;

        const careerScores = {};
        let bestCareer = null;
        let highestScore = -1;

        // Calculate score for each defined career based on strict matching,
        // but add a baseline weighted by their overall technical proficiency
        for (const [careerName, requiredSkills] of Object.entries(CAREER_SKILL_DATASET)) {
            let totalScore = 0;
            let matchedSkills = 0;
            const numSkills = requiredSkills.length;

            requiredSkills.forEach(skill => {
                if (assessmentMap.hasOwnProperty(skill.toLowerCase())) {
                    totalScore += assessmentMap[skill.toLowerCase()];
                    matchedSkills++;
                }
            });

            // If they have matched skills, use that. Otherwise, fallback to their general average 
            // proficiency minus a penalty for not having the strict domain skills.
            let averageScore;
            if (matchedSkills > 0) {
                // Blend their specific matched skill score with their general proficiency
                const specificScore = totalScore / matchedSkills;
                averageScore = Math.round((specificScore * 0.7) + (averageUserScore * 0.3));
            } else {
                averageScore = Math.round(averageUserScore * 0.6); // Penalty
            }

            careerScores[careerName] = averageScore;

            if (averageScore > highestScore) {
                highestScore = averageScore;
                bestCareer = careerName;
            }
        }

        // Identify missing/weak skills globally from what they assessed themselves on
        const missingSkills = [];
        userAssessments.forEach(item => {
            if (item.score < 50) {
                missingSkills.push(item.subject);
            }
        });

        // Add core missing skills from the best career if they strictly don't have them
        if (bestCareer) {
            const requiredSkills = CAREER_SKILL_DATASET[bestCareer];
            requiredSkills.forEach(skill => {
                if (!assessmentMap.hasOwnProperty(skill.toLowerCase())) {
                    if (!missingSkills.includes(skill)) {
                        missingSkills.push(skill);
                    }
                }
            });
        }

        return {
            recommended_career: bestCareer || 'Software Engineer',
            career_scores: careerScores,
            missing_skills: missingSkills.slice(0, 5) // Cap to avoid overwhelming
        };
    }
}

module.exports = new CareerPredictionService();
