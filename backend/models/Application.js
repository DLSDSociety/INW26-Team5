const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true },
  seekerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seekerName:   { type: String },
  seekerEmail:  { type: String },
  status:       { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  appliedAt:    { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
