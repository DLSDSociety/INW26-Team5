const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  company:     { type: String, required: true, trim: true },
  location:    { type: String, required: true, trim: true },
  salary:      { type: String, default: 'Not disclosed' },
  category:    { type: String, default: 'Engineering' },
  type:        { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], required: true },
  description: { type: String, required: true },
  employerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
