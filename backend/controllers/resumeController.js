const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');

// @route POST /api/resume/upload  [seeker only]
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // If user already has a resume, delete the old file + record
    const existing = await Resume.findOne({ userId: req.user.id });
    if (existing) {
      if (fs.existsSync(existing.filePath)) fs.unlinkSync(existing.filePath);
      await existing.deleteOne();
    }

    const resume = await Resume.create({
      userId:       req.user.id,
      userName:     req.user.name,
      originalName: req.file.originalname,
      fileName:     req.file.filename,
      filePath:     req.file.path,
      fileSize:     req.file.size,
      mimeType:     req.file.mimetype,
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id:           resume._id,
        originalName: resume.originalName,
        fileSize:     resume.fileSize,
        uploadedAt:   resume.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/me  [seeker only]
const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'No resume found' });

    res.json({
      id:           resume._id,
      originalName: resume.originalName,
      fileSize:     resume.fileSize,
      uploadedAt:   resume.uploadedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/download/:userId  [employer/admin only]
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

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
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'No resume found' });

    if (fs.existsSync(resume.filePath)) fs.unlinkSync(resume.filePath);
    await resume.deleteOne();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadResume, getMyResume, downloadResume, deleteResume };
