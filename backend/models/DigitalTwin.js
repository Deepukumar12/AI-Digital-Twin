const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  confidence: { type: Number, default: 50 }
});

const roadmapSchema = new mongoose.Schema({
  task: String,
  type: { type: String, enum: ['Learn', 'Build', 'Apply', 'Other'], default: 'Learn' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
});

const digitalTwinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // AI Extracted Core
  primary_domain: { type: String, default: 'Awaiting Data...' },
  technical_skills: [skillSchema],
  soft_skills: [String],
  recommended_roles: [String],
  strengths: [String],
  weaknesses: [String],

  // Scoring & Analytics
  career_readiness_score: { type: Number, default: 0 }, // AI projected
  skill_strength_score: { type: Number, default: 0 },   // Calculated from DB
  alignment_percentage: { type: Number, default: 0 },   // Match against target
  twin_confidence_index: { type: Number, default: 0 },  // Data depth score

  // Dynamic Growth
  target_role: { type: String, default: 'Not Set' },
  missing_skills: [String],
  ignored_skills: [String],
  roadmap: [roadmapSchema],

  // Career Prediction Engine Outcomes
  skill_assessments: [{
    subject: String,
    score: Number
  }],
  career_predictions: { type: Map, of: Number }, // Maps career name to suitability score
  recommended_career: { type: String, default: null },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DigitalTwin', digitalTwinSchema);
