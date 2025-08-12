const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const candidateRoutes = require('./routes/candidateRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/candidate', candidateRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running...");
        });
    })
    .catch((err) => console.error("MongoDB connection failed:", err));
