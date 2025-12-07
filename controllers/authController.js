// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { email, password, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib' });

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const result = await User.create({ email, password, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon });
    const token = generateToken(result.insertId);

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: result.insertId,
        email,
        nama_lengkap,
        role: 'user'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib' });

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Email atau password salah' });

    const valid = await User.comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Email atau password salah' });

    const token = generateToken(user.id);
    // remove sensitive fields
    const safeUser = {
      id: user.id,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      role: user.role
    };

    res.json({ message: 'Login berhasil', token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user diset di middleware authenticate
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// NEW: Update profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon } = req.body;

    // Validate required field
    if (!nama_lengkap || nama_lengkap.trim() === '') {
      return res.status(400).json({ message: 'Nama lengkap wajib diisi' });
    }

    const updateData = {
      nama_lengkap: nama_lengkap.trim(),
      tanggal_lahir: tanggal_lahir || null,
      tempat_lahir: tempat_lahir ? tempat_lahir.trim() : null,
      alamat: alamat ? alamat.trim() : null,
      no_telepon: no_telepon ? no_telepon.trim() : null
    };

    await User.updateProfile(userId, updateData);

    // Get updated user data
    const updatedUser = await User.findById(userId);

    res.json({
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// NEW: Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // Validate input
    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Password lama dan baru wajib diisi' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    // Get user with password
    const user = await User.findByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Verify current password
    const valid = await User.comparePassword(current_password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Password lama tidak sesuai' });
    }

    // Update password
    await User.updatePassword(userId, new_password);

    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};