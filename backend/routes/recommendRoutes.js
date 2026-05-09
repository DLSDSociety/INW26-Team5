const express = require('express');
const router = express.Router();
const { recommendJobs } = require('../controllers/recommendController');
const { protect, isSeeker } = require('../middleware/authMiddleware');

router.get('/', protect, isSeeker, recommendJobs);

module.exports = router;