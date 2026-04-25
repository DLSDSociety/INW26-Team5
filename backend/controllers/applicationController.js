// In-memory applications store (replace with MongoDB later)
const applications = [];

// @route  POST /api/applications  [seeker only]
const applyJob = (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Check if already applied
    const alreadyApplied = applications.find(
      (app) => app.jobId === jobId && app.seekerId === req.user.id
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const newApplication = {
      id: Date.now().toString(),
      jobId,
      seekerId: req.user.id,
      seekerName: req.user.name,
      seekerEmail: req.user.email,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    applications.push(newApplication);

    res.status(201).json({
      message: 'Application submitted successfully',
      application: newApplication,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/applications/me  [seeker only]
const getMyApplications = (req, res) => {
  try {
    const myApps = applications.filter(
      (app) => app.seekerId === req.user.id
    );

    res.json({ count: myApps.length, applications: myApps });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/applications/job/:id  [employer only]
const getApplicantsByJob = (req, res) => {
  try {
    const jobApps = applications.filter(
      (app) => app.jobId === req.params.id
    );

    res.json({ count: jobApps.length, applications: jobApps });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/applications/:id  [employer only]
const updateApplicationStatus = (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const index = applications.findIndex((app) => app.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Application not found' });
    }

    applications[index].status = status;

    res.json({
      message: 'Application status updated',
      application: applications[index],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyJob, getMyApplications, getApplicantsByJob, updateApplicationStatus, applications };