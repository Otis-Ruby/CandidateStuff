const mongoose = require('mongoose')

const roundSchema = new mongoose.Schema({
    hiringId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hiring', required: true },
    outCount: { type: Number, required: true },
    roundType: { type: String, required: true },
    requirements: { type: [String], required: true },
    questionCount: { type: Number, required: true },
    difficulty: { type: Number, required: true },
    questionType: { type: String, required: true },
    candidateCount: { type: Number, default: 0 },
    startedAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    allocatedTime: { type: Date, required: true },
    resultTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema)