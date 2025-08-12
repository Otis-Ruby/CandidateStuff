const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, immutable: true },
    hiringId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hiring', required: true, immutable: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true, immutable: true },
    roundType: { type: String, required: true, immutable: true },
    status: { type: String, enum: ["Accepted", "Rejected", "Unattended"] },
    score: { type: Number },
    report: { type: String },
    errors: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);