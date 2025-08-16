// routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const { validateMCQAnswers, validateFITBAnswers } = require('../controllers/validateController');

router.post('/submit-mcq', validateMCQAnswers);
router.post('/submit-fitb', validateFITBAnswers);

module.exports = router;
