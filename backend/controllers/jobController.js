const Job = require('../models/Job');

// @route  GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type)     filter.type     = { $regex: `^${type}$`, $options: 'i' };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json({ count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/jobs  [employer only]
const createJob = async (req, res) => {
  try {
    const { title, company, location, salary, type, description, category } = req.body;

    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const job = await Job.create({
      title, company, location,
      salary: salary || 'Not disclosed',
      category: category || 'Engineering',
      type, description,
      employerId: req.user.id,
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/jobs/:id  [employer only]
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/jobs/:id  [employer only]
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
