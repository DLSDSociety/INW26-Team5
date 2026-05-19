
const dotenv = require('dotenv');
dotenv.config(); // Load env vars FIRST, before any module that reads process.env

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');   
const recommendRoutes = require('./routes/recommendRoutes');

connectDB();                                

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes        = require('./routes/authRoutes');
const jobRoutes         = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const resumeRoutes      = require('./routes/resumeRoutes');

app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/resume',       resumeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/recommend', recommendRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Job Portal API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});