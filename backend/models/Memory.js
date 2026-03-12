const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    document: {
        type: String,
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Number,
        default: () => Date.now()
    }
}, { timestamps: true });

// Create a text index for high-performance keyword searching as a semantic fallback
MemorySchema.index({ document: 'text' });

module.exports = mongoose.model('Memory', MemorySchema);
