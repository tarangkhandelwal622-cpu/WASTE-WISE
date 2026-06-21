const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { startScan, getRecentScans, getScanResults, getSeasonalSuggestion, getVisionData } = require('../controllers/scan.controller');

const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/analyse', authMiddleware, upload.single('photo'), startScan);
router.post('/vision', authMiddleware, upload.single('photo'), getVisionData);
router.get('/recent', authMiddleware, getRecentScans);
router.get('/results/:scanId', authMiddleware, getScanResults);
router.get('/seasonal', authMiddleware, getSeasonalSuggestion);

module.exports = router;
