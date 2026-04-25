// In-memory references (same arrays used in other controllers)
const { users } = require('./authController');
const { jobs } = require('./jobController');
const { applications } = require('./applicationController');

// @route GET /api/admin/stats
const getStats = (req, res) => {
  try {
    res.json({
      totalUsers: users.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      hires: applications.filter(a => a.status === 'accepted').length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/admin/users
const getAllUsers = (req, res) => {
  try {
    const safeUsers = users.map(({ password, ...rest }) => rest);
    res.json({ count: safeUsers.length, users: safeUsers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route DELETE /api/admin/users/:id
const deleteUser = (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/admin/jobs
const getAllJobs = (req, res) => {
  try {
    res.json({ count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route DELETE /api/admin/jobs/:id
const deleteJob = (req, res) => {
  try {
    const index = jobs.findIndex(j => j.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }
    jobs.splice(index, 1);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/admin/applications
const getAllApplications = (req, res) => {
  try {
    res.json({ count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
};