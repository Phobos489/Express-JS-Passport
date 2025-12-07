// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const requirementRoutes = require('./routes/requirements');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requirements', requirementRoutes);

// Global error handler (multer errors included)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File terlalu besar. Maksimal 5MB' });
  }
  if (err.message && err.message.includes('Hanya file')) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

module.exports = app;
