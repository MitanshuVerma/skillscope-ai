const express = require('express');
const multer = require('multer');
const { extractSkills } = require('../controllers/resumeController');
const { getJobs } = require('../controllers/jobController');
const { getInsights } = require('../controllers/insightController');
const { protectOptional } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Resume & Skills
router.post('/upload-resume', protectOptional, upload.single('resume'), extractSkills);

// Jobs
router.post('/jobs', protectOptional, getJobs);

// Roadmap
const { generateRoadmap } = require('../controllers/roadmapController');
router.post('/roadmap', generateRoadmap);

// Market
const { getMarketStatus, getTrendingJobs } = require('../controllers/marketController');
router.get('/market-status', getMarketStatus);
router.get('/trending-jobs', getTrendingJobs);

// Insights
router.post('/insights', getInsights);

module.exports = router;
