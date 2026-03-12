# System Architecture: AI Personal Digital Twin
## Career Intelligence Platform (Master Spec v1.0)

This document describes the high-level architecture and data flow for the production-ready AI Digital Twin system.

```mermaid
graph TD
    subgraph "Frontend (React)"
        Dashboard["Dashboard (Recharts)"]
        Chat["Career Mentor Chat"]
        Upload["Resume Upload"]
        Simulator["Future Simulator"]
    end

    subgraph "AI Intelligence Layer (Node.js)"
        Gateway["AI Gateway (Groq → HF → Local)"]
        Memory["Vector Memory (ChromaDB)"]
        Market["Market Engine (Remotive API)"]
        Analytics["Analytics Engine (Weighted Scoring)"]
    end

    subgraph "Persistence & External"
        MongoDB[("MongoDB (User & Twin Data)")]
        Groq["Groq API (Llama-3-70b)"]
        HF["HuggingFace (Mistral)"]
        Remotive["Remotive Remote Jobs API"]
    end

    Dashboard --> Gateway
    Chat --> Memory
    Upload --> Gateway
    Gateway --> Groq
    Gateway --> HF
    Gateway --> MongoDB
    Memory --> Gateway
    Gateway --> Analytics
    Market --> Remotive
```

### Core Components
1. **Dynamic Dashboard**: Responsive UI with real-time charting using Recharts.
2. **AI Gateway**: Multi-provider fallback orchestration (Groq primary, HuggingFace fallback).
3. **Vector Memory**: Long-term context storage using ChromaDB for semantic chat retrieval.
4. **Market Engine**: Real-time correlation with Remotive's job market data.
5. **Weighted Analytics**: Custom scoring algorithms for Skill Strength and Career Alignment.
