# Data Flow & ER Diagram
## Schema Architecture (Master Spec)

### Entity Relationship Model

```mermaid
erDiagram
    USER ||--|| DIGITAL_TWIN : has
    USER {
        string _id PK
        string email
        string password
        string name
        string bio
    }
    DIGITAL_TWIN {
        string _id PK
        string userId FK
        string primary_domain
        array technical_skills
        array soft_skills
        number career_readiness_score
        number skill_strength_score
        number alignment_percentage
        string target_role
        array roadmap
    }
    DIGITAL_TWIN ||--o{ MEMORY : "synced from"
    MEMORY {
        string id PK
        string userId FK
        string document
        object metadata
    }
```

### Intelligence Data Flow
1. **Input**: User uploads PDF.
2. **Parsing**: `pdf-parse` extracts raw text.
3. **Extraction**: AI Gateway invokes Groq (Llama-3) to structure text into `DigitalTwin` schema.
4. **Memory Injection**: Raw resume and extracted profile stored in ChromaDB.
5. **Real-time Scoring**: `analyticsService` calculates current readiness and alignment.
6. **Market Sync**: `marketService` pulls Remotive trends for the extracted domain.
7. **Simulation**: User interacts with Copilot to test hypothetical career scenarios (AI generated).
