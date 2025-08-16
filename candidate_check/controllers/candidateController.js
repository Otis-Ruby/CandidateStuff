const Candidate = require('../models/Candidate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hiring = require('../models/Hiring'); 
const Round = require('../models/Round'); 
const Record = require('../models/Record');

// POST /signup
async function signup(req, res) {
    try {
        const candidate = req.body;

        // Check if any existing candidate with same email, phone or LinkedIn
        const existing = await Candidate.findOne({
            $or: [
                { email: candidate.email },
                { phone: candidate.phone },
                { linkedIn: candidate.linkedIn }
            ]
        });

        if (existing) {
            const conflicts = [];
            if (existing.email === candidate.email) conflicts.push("Email");
            if (existing.phone === candidate.phone) conflicts.push("Phone");
            if (existing.linkedIn === candidate.linkedIn) conflicts.push("LinkedIn URL");

            return res.status(400).json({
                message: `Candidate already registered with given ${conflicts.join(", ")}`
            });
        }
        
        const hashedPassword = await bcrypt.hash(candidate.password, 10);
        candidate.password = hashedPassword;

        const newCandidate = await Candidate.create(candidate);

        // Generate JWT token
        const token = jwt.sign(
            { id: newCandidate._id, role: 'candidate' },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "Signup successful",
            token,
            candidate: {
                name: newCandidate.name,
                email: newCandidate.email,
                phone: newCandidate.phone,
                age: newCandidate.age,
                address: newCandidate.address,
                linkedIn: newCandidate.linkedIn,
                gender: newCandidate.gender
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// POST /login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ message: "Candidate not found with given email" });
        }

        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password, try again" });
        }

        const token = jwt.sign(
            { id: candidate._id, role: 'candidate' },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            candidate: {
                name: candidate.name,
                email: candidate.email,
                phone: candidate.phone,
                age: candidate.age,
                address: candidate.address,
                linkedIn: candidate.linkedIn,
                gender: candidate.gender
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


// GET /profile
async function getProfile  (req, res)  {
    try {
        const candidate = await Candidate.findById(req.token.id).select('-password');
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
};

// PUT /profile
async function updateProfile(req, res)  {
    try {
        const updates = req.body;
        const candidate = await Candidate.findByIdAndUpdate(
            req.token.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated", candidate });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

const getAllHiring = async (req, res) => {
    try {
        const allHiring = await Hiring.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json(allHiring);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching hiring data" });
    }
};

const getRoundsByHiringId = async (req, res) => {
    try {
        const { hiringId } = req.params;

        const rounds = await Round.find({ hiringId }).sort({ createdAt: 1 });

        if (!rounds || rounds.length === 0) {
            return res.status(404).json({ message: "No rounds found for this hiring" });
        }

        res.status(200).json(rounds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching rounds", error: error.message });
    }
};

const applyToHiring = async (req, res) => {
    try {
        const candidateId = req.token.id;
        const { hiringId } = req.params;

        // Check if already applied
        const existing = await Record.findOne({ candidateId, hiringId });
        if (existing) return res.status(400).json({ message: "Already applied." });

        // Find Hiring
        const hiring = await Hiring.findById(hiringId);
        if (!hiring) return res.status(404).json({ message: "Hiring not found" });

        // Get first round of this hiring
        const firstRound = await Round.findOne({ hiringId }).sort({ createdAt: 1 });
        if (!firstRound) return res.status(404).json({ message: "No rounds found" });

        // Create application record
        const newRecord = await Record.create({
            candidateId,
            hiringId,
            roundId: firstRound._id,
            roundType: firstRound.roundType,
            status: "Unattended",
            score: null,
            report: "",
            errors: ""
        });

        res.status(201).json({ message: "Successfully applied", record: newRecord });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while applying", error: err.message });
    }
};





module.exports={signup, login, getProfile, updateProfile, getAllHiring, getRoundsByHiringId,applyToHiring};
