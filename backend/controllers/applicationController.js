
const Application = require('../models/Application');
const Job = require('../models/Job');

// @route  POST /api/applications  [seeker only]
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const alreadyApplied = await Application.findOne({ jobId, seekerId: req.user.id });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      jobId,
      seekerId:    req.user.id,
      seekerName:  req.user.name,
      seekerEmail: req.user.email,
      status:      'pending',
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/applications/me  [seeker only]
// const getMyApplications = async (req, res) => {
//   try {
//     const applications = await Application.find({ seekerId: req.user.id })
//       .sort({ appliedAt: -1 });

//     res.json({ count: applications.length, applications });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user.id })
      .populate('jobId', 'title company location type')
      .sort({ appliedAt: -1 });

    res.json({ count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/applications/job/:id  [employer only]
const getApplicantsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.id })
      .sort({ appliedAt: -1 });

    res.json({ count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/applications/:id  [employer only]
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyJob, getMyApplications, getApplicantsByJob, updateApplicationStatus };
