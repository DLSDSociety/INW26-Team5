const path = require('path');
const fs = require('fs');

// In-memory resume store (replace with MongoDB later)
const resumes = [];

// @route POST /api/resume/upload  [seeker only]
const uploadResume = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if user already has a resume — remove old one
    const existingIndex = resumes.findIndex(r => r.userId === req.user.id);
    if (existingIndex !== -1) {
      // Delete old file from disk
      const oldPath = resumes[existingIndex].filePath;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      resumes.splice(existingIndex, 1);
    }

    // Save new resume record
    const newResume = {
      id: Date.now().toString(),
      userId: req.user.id,
      userName: req.user.name,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
    };

    resumes.push(newResume);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: newResume.id,
        originalName: newResume.originalName,
        fileSize: newResume.fileSize,
        uploadedAt: newResume.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/me  [seeker only]
const getMyResume = (req, res) => {
  try {
    const resume = resumes.find(r => r.userId === req.user.id);
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    res.json({
      id: resume.id,
      originalName: resume.originalName,
      fileSize: resume.fileSize,
      uploadedAt: resume.uploadedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/download/:userId  [employer/admin only]
const downloadResume = (req, res) => {
  try {
    const resume = resumes.find(r => r.userId === req.params.userId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const filePath = path.resolve(resume.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, resume.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route DELETE /api/resume/me  [seeker only]
const deleteResume = (req, res) => {
  try {
    const index = resumes.findIndex(r => r.userId === req.user.id);
    if (index === -1) {
      return res.status(404).json({ message: 'No resume found' });
    }

    // Delete file from disk
    const filePath = resumes[index].filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    resumes.splice(index, 1);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadResume, getMyResume, downloadResume, deleteResume, resumes };