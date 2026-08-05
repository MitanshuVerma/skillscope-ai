const express = require('express');
const multer = require('multer');
const { extractSkills } = require('../controllers/resumeController');
const { getJobs } = require('../controllers/jobController');
const { getInsights } = require('../controllers/insightController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Resume & Skills
router.post('/upload-resume', upload.single('resume'), extractSkills);

// Jobs
router.post('/jobs', getJobs);

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
