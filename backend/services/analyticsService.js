/**
 * analyticsService.js
 * 
 * Career Alignment & Skill Strength Engine.
 * Implements weighted scoring and role matching.
 */

const ROLE_DATASET = {
    "Backend Developer": ["Node.js", "Express", "MongoDB", "REST API", "Authentication", "SQL", "Docker"],
    "Frontend Developer": ["React", "JavaScript", "HTML", "CSS", "TailwindCSS", "State Management", "TypeScript"],
    "Full Stack Developer": ["Node.js", "React", "MongoDB", "Express", "REST API", "Authentication", "AWS"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Linux", "Python"],
    "Data Scientist": ["Python", "Machine Learning", "SQL", "Pandas", "Scikit-Learn", "Data Visualization", "Stats"]
};

/**
 * Calculate Weighted Skill Strength Score
 * Formula: Sum(LevelWeight * Confidence) / MaxPossible
 * Beginner = 1, Intermediate = 2, Advanced = 3
 */
const calculateSkillStrengthScore = (skills = []) => {
    if (!skills.length) return 0;

    const weights = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
    let totalScore = 0;
    
    skills.forEach(skill => {
        const weight = weights[skill.level] || 1;
        const confidence = skill.confidence || 50;
        totalScore += (weight * (confidence / 100));
    });

    // Normalized to 100
    const maxPossiblePerSkill = 3; 
    const score = (totalScore / (skills.length * maxPossiblePerSkill)) * 100;
    return Math.round(Math.min(score, 100));
};

/**
 * Calculate Career Alignment Score
 * Formula: (commonSkills / requiredSkills) * 100
 * Uses weighted scoring for primary requirements.
 */
const calculateCareerAlignment = (userSkills = [], targetRole = "Full Stack Developer", dynamicRequiredSkills = null) => {
    const requiredSkills = dynamicRequiredSkills || ROLE_DATASET[targetRole] || ROLE_DATASET["Full Stack Developer"];
    const userSkillNames = userSkills.map(s => s.name.toLowerCase());
    
    let matches = 0;
    requiredSkills.forEach(skill => {
        if (userSkillNames.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))) {
            matches++;
        }
    });

    const alignment = (matches / requiredSkills.length) * 100;
    return Math.round(alignment);
};

/**
 * Detect Skill Gaps
 */
const detectSkillGaps = (userSkills = [], targetRole = "Full Stack Developer", dynamicRequiredSkills = null) => {
    const requiredSkills = dynamicRequiredSkills || ROLE_DATASET[targetRole] || ROLE_DATASET["Full Stack Developer"];
    const userSkillNames = userSkills.map(s => s.name.toLowerCase());

    return requiredSkills.filter(req => 
        !userSkillNames.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))
    );
};

/**
 * Calculate Twin Confidence Index
 * Measures the depth and variety of data available.
 */
const calculateTwinConfidenceIndex = (twin, activeSkills, chatCount) => {
    let index = 0;
    if (activeSkills.length > 5) index += 30;
    if (activeSkills.length > 10) index += 20;
    if (twin.primary_domain !== 'Unknown') index += 20;
    if (chatCount > 0) index += 10;
    if (twin.career_readiness_score > 70) index += 20;
    
    return Math.min(index, 100);
};

module.exports = {
    calculateSkillStrengthScore,
    calculateCareerAlignment,
    detectSkillGaps,
    calculateTwinConfidenceIndex,
    ROLE_DATASET
};
