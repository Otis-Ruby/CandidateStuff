const mongoose = require('mongoose')

const hiringSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    companyCRN: { type: String, required: true },
    ctc: { type: String, required: true },
    type: { type: String, enum: ["FULL_TIME", "PART_TIME", "INTERN", "CONTRACT", "FREELANCE"], required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    openings: { type: Number, required: true },
    numberOfRounds: { type: Number, required: true },
    requirements: { type: [String], required: true },
    status: { type: String, enum: ["COMPLETED", "ONGOING", "UPCOMING"], default: "UPCOMING" },
}, { timestamps: true });

module.exports = mongoose.model('Hiring', hiringSchema)