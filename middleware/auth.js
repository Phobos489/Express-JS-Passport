// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    const token = header ? header.replace('Bearer ', '') : null;
    if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Token tidak valid.' });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};

const authorize = (roles = []) => {
  // roles: array seperti ['admin'] atau ['user']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
