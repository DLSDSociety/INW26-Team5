const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getApplicantsByJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, isSeeker, isEmployer } = require('../middleware/authMiddleware');

// Seeker routes
router.post('/', protect, isSeeker, applyJob);
router.get('/me', protect, isSeeker, getMyApplications);

// Employer routes
router.get('/job/:id', protect, isEmployer, getApplicantsByJob);
router.put('/:id', protect, isEmployer, updateApplicationStatus);

module.exports = router;