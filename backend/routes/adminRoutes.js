const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All admin routes are protected + admin only
router.use(protect, isAdmin);

router.get('/stats',        getStats);
router.get('/users',        getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs',         getAllJobs);
router.delete('/jobs/:id',  deleteJob);
router.get('/applications', getAllApplications);

module.exports = router;