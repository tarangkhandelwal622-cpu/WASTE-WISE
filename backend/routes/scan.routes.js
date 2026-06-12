const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { startScan, getRecentScans, getScanResults, getSeasonalSuggestion } = require('../controllers/scan.controller');

router.post('/analyse', authMiddleware, startScan);
router.get('/recent', authMiddleware, getRecentScans);
router.get('/results/:scanId', authMiddleware, getScanResults);
router.get('/seasonal', authMiddleware, getSeasonalSuggestion);

module.exports = router;
