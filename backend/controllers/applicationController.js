
const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

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

    // Fetch Job to get title for the email
    const job = await Job.findById(application.jobId);
    
    // Send Status Update Email asynchronously
    if (job && application.seekerEmail) {
      const statusColor = status === 'accepted' ? '#16a34a' : status === 'rejected' ? '#dc2626' : '#2563eb';
      
      const htmlTemplate = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Application Status Update</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #334155; font-size: 16px;">Hello ${application.seekerName},</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            There has been an update regarding your application for the <strong>${job.title}</strong> position at <strong>${job.company}</strong>.
          </p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Current Status</p>
            <h1 style="margin: 10px 0 0 0; color: ${statusColor}; text-transform: uppercase;">${status}</h1>
          </div>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            ${status === 'accepted' ? 'Congratulations! The employer will be in touch with you shortly regarding the next steps.' : status === 'rejected' ? 'Unfortunately, the employer has decided to move forward with other candidates. Keep applying!' : 'Your application is currently being reviewed by the employer.'}
          </p>
          <div style="text-align: center; margin-top: 35px;">
            <a href="http://localhost:5173/dashboard" style="background-color: #FF6B35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Dashboard</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
            © ${new Date().getFullYear()} Job & Career Portal. All rights reserved.
          </p>
        </div>
      `;

      sendEmail({
        email: application.seekerEmail,
        subject: `Update on your application: ${job.title}`,
        message: `Hello ${application.seekerName},\n\nYour application status for the role of ${job.title} at ${job.company} has been updated to: ${status.toUpperCase()}.`,
        html: htmlTemplate
      });
    }

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyJob, getMyApplications, getApplicantsByJob, updateApplicationStatus };
