const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const jobMarketRoutes = require('./routes/jobMarketRoutes');
const careerPredictionRoutes = require('./routes/careerPredictionRoutes');
const twinRoutes = require('./routes/twinRoutes'); // Added twinRoutes

// Services
const { initMemory } = require('./services/memoryService');

const app = express();

// Initialize Memory System
initMemory().then(success => {
    if (success) console.log("[App] Career Vector Memory Online.");
    else console.log("[App] Career Vector Memory running in session-only mode.");
});

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job-market', jobMarketRoutes);
app.use('/api/career', careerPredictionRoutes); // Mount self-assessment and prediction logic
app.use('/api', twinRoutes); // Mount twin and chat routes

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aidigitaltwin';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        // Robust server startup with EADDRINUSE retry
        const startServer = (retries = 5) => {
            const server = app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            }).on('error', (err) => {
                if (err.code === 'EADDRINUSE' && retries > 0) {
                    console.log(`Port ${PORT} in use, retrying in 2s... (${retries} attempts left)`);
                    setTimeout(() => {
                        server.close();
                        startServer(retries - 1);
                    }, 2000);
                } else {
                    console.error('Server failed to start:', err);
                }
            });
        };

        startServer();
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
