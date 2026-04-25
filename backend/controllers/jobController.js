// In-memory jobs store 
const jobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    salary: '₹6-8 LPA',
    type: 'Full-time',
    description: 'We are looking for a skilled Frontend Developer with React experience.',
    employerId: 'employer1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Infosys',
    location: 'Bangalore',
    salary: '₹8-12 LPA',
    type: 'Full-time',
    description: 'Looking for a Node.js backend developer with MongoDB experience.',
    employerId: 'employer1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Wipro',
    location: 'Hyderabad',
    salary: '₹4-6 LPA',
    type: 'Part-time',
    description: 'Creative UI/UX designer needed for our product team.',
    employerId: 'employer2',
    createdAt: new Date().toISOString(),
  },

{
  id: '4',
  title: 'AI Engineer',
  company: 'Azad Pvt Ltd.',
  location: 'Assam',
  salary: '₹6 LPA',
  type: 'Full-time',
  description: 'Looking for an AI Engineer with knowledge of AI/ML to work on innovative solutions.',
  employerId: 'employer2',
  createdAt: new Date().toISOString(),
}


];

// @route  GET /api/jobs
const getJobs = (req, res) => {
  try {
    let filtered = [...jobs];

    const { search, location, type } = req.query;

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(s) ||
          job.company.toLowerCase().includes(s)
      );
    }

    if (location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter(
        (job) => job.type.toLowerCase() === type.toLowerCase()
      );
    }

    res.json({ count: filtered.length, jobs: filtered });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/jobs/:id
const getJobById = (req, res) => {
  try {
    const job = jobs.find((j) => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/jobs  [employer only]
const createJob = (req, res) => {
  try {
    const { title, company, location, salary, type, description } = req.body;

    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newJob = {
      id: Date.now().toString(),
      title,
      company,
      location,
      salary: salary || 'Not disclosed',
      type,
      description,
      employerId: req.user.id,
      createdAt: new Date().toISOString(),
    };

    jobs.push(newJob);

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/jobs/:id  [employer only]
const updateJob = (req, res) => {
  try {
    const index = jobs.findIndex((j) => j.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the employer who posted can update
    if (jobs[index].employerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    jobs[index] = { ...jobs[index], ...req.body, id: jobs[index].id };

    res.json({ message: 'Job updated successfully', job: jobs[index] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/jobs/:id  [employer only]
const deleteJob = (req, res) => {
  try {
    const index = jobs.findIndex((j) => j.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the employer who posted can delete
    if (jobs[index].employerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    jobs.splice(index, 1);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, jobs };