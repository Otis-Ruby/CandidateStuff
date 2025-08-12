const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true, immutable: true },
    email: { type: String, required: true, unique: true, match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, immutable: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true, match: /^\+?[0-9]{7,15}$/ },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    linkedIn: { type: String, required: true, match: /^https?:\/\/(www\.)?linkedin\.com\/.*$/i, unique: true, immutable: true },
    gender: { type: String, enum: ["Prefer not to say", "Male", "Female"], required: true, immutable: true }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);