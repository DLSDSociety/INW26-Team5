const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['seeker', 'employer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(newUser);

    // Send Welcome Email asynchronously
    const isStudent = newUser.role === 'seeker';
    const title = isStudent ? 'Welcome to Your Career Journey!' : 'Welcome to Job Portal Employer Network!';
    
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h1 style="color: #FF6B35; text-align: center; margin-bottom: 5px;">Job & Career Portal</h1>
        <p style="text-align: center; color: #64748b; margin-top: 0;">Your gateway to success</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
        <h2 style="color: #0f172a;">Hello ${newUser.name},</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          ${isStudent ? 'We are absolutely thrilled to welcome you! Start exploring thousands of jobs tailored to your skills and apply with a single click. Your dream job is just around the corner.' : 'Welcome aboard! You can now start posting job listings and connecting with top talent across the globe.'}
        </p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #0f172a;">Account Details:</h3>
          <p style="margin: 5px 0; color: #475569;"><strong>Name:</strong> ${newUser.name}</p>
          <p style="margin: 5px 0; color: #475569;"><strong>Role:</strong> ${newUser.role.toUpperCase()}</p>
        </div>
        <div style="text-align: center; margin-top: 35px;">
          <a href="http://localhost:5173/login" style="background-color: #FF6B35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
          © ${new Date().getFullYear()} Job & Career Portal. All rights reserved.
        </p>
      </div>
    `;

    sendEmail({
      email: newUser.email,
      subject: title,
      message: `Hello ${newUser.name},\n\nWelcome to Job Portal! Your account has been successfully created.`,
      html: htmlTemplate
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe };
