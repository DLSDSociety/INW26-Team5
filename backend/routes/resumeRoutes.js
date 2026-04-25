const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getMyResume,
  downloadResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect, isSeeker, isEmployer, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Seeker routes
router.post('/upload', protect, isSeeker, upload.single('resume'), uploadResume);
router.get('/me',      protect, isSeeker, getMyResume);
router.delete('/me',   protect, isSeeker, deleteResume);

// Employer/Admin can download a seeker's resume
router.get('/download/:userId', protect, downloadResume);

module.exports = router;