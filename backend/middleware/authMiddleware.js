const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB so req.user always has current name/email/role
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

const isEmployer = (req, res, next) => {
  if (req.user?.role === 'employer') return next();
  res.status(403).json({ message: 'Access denied, employers only' });
};

const isSeeker = (req, res, next) => {
  if (req.user?.role === 'seeker') return next();
  res.status(403).json({ message: 'Access denied, seekers only' });
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied, admins only' });
};

module.exports = { protect, isEmployer, isSeeker, isAdmin };
