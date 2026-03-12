# Intelligence Algorithms & AI Prompts
## Master Spec v1.0 Intelligence Layer

### 1. Skill Strength Formula (Weighted)
This formula calculates the user's overall technical depth across all active skills.
- **Beginner**: 1.0 weight
- **Intermediate**: 2.0 weight
- **Advanced**: 3.0 weight
- **Confidence**: 0.0 to 1.0 multiplier

$$Score = \frac{\sum (Weight \times Confidence)}{\sum MaxPossibleWeight} \times 100$$

### 2. Career Alignment Algorithm
Measures how well the Digital Twin's current skill set maps to the requirements of the `target_role`.
- **Match Calculation**: Binary check (contains/fuzzy-match) against `ROLE_DATASET`.
- **Target Role**: Defaulted to `primary_domain` if not user-specified.

### 3. AI Prompts (Optimized for Groq Llama-3-70b)

#### A. Resume Extraction (Structured JSON)
**System**: `You are an AI Career Intelligence Engine. Extract structured data from resumes. Always return VALID JSON.`
**Prompt**:
```text
Analyze this resume and return JSON with keys: 
technical_skills (array of {name, level, confidence}), 
soft_skills (array), 
primary_domain, 
recommended_roles (array), 
strengths (array), 
weaknesses (array), 
career_readiness_score (number 0-100).

Resume: {{RESUME_TEXT}}
```

#### B. Career Simulation (Predictive Analytics)
**System**: `You are a Career Simulator. Predict the impact of career changes.`
**Prompt**:
```text
Current Profile: {{TWIN_DATA}}
Scenario: {{USER_SCENARIO}}
Return JSON prediction with impact on alignment_percentage, new_roles_unlocked (array), and projected_salary_impact_percentage.
```

### 4. Vector Memory (ChromaDB)
Semantic context is retrieved using cosine similarity on embeddings of previous chat history and resume segments, ensuring the "Mentor Chat" remembers the user's career evolution.
