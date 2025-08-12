const express = require('express');
const router = express.Router();
const {login,signup,updateProfile,getProfile,getAllHiring,getRoundsByHiringId,applyToHiring} = require('../controllers/candidateController');
const { authorizeMiddleware } = require('../middleware/authorizeMiddleware');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Routes
router.get('/getprofile', authorizeMiddleware("candidate"), getProfile);
router.put('/updateprofile', authorizeMiddleware("candidate"), updateProfile);
// Get all hiring for candidates
router.get('/allhiring', authorizeMiddleware("candidate"), getAllHiring);
router.get('/rounds/:hiringId', authorizeMiddleware("candidate"), getRoundsByHiringId);
router.post('/apply/:hiringId', authorizeMiddleware("candidate"), applyToHiring);


module.exports = router;
