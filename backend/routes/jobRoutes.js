const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, isEmployer } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes (employer only)
router.post('/', protect, isEmployer, createJob);
router.put('/:id', protect, isEmployer, updateJob);
router.delete('/:id', protect, isEmployer, deleteJob);

module.exports = router;