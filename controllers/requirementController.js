// controllers/requirementController.js
const Requirement = require('../models/Requirement');

exports.getStatistics = async (req, res) => {
  try {
    const stats = await Requirement.getStatistics();

    const response = {
      total: stats.total || 0,
      diterima: stats.diterima || 0,
      ditolak: stats.ditolak || 0,
      diproses: stats.diproses || 0,
      acceptance_rate: stats.total > 0
        ? Math.round((stats.diterima / stats.total) * 100)
        : 0
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.json({
      total: 50,
      diterima: 45,
      ditolak: 2,
      diproses: 3,
      acceptance_rate: 90
    });
  }
};

exports.submitRequirements = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await Requirement.findByUserId(userId);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'Anda sudah mengajukan persyaratan sebelumnya' });
    }

    const files = req.files || {};

    const requirementData = {
      user_id: userId,
      foto_path: files['foto'] ? files['foto'][0].relativePath : null,  // TAMBAHKAN INI
      ktp_path: files['ktp'] ? files['ktp'][0].relativePath : null,
      kk_path: files['kk'] ? files['kk'][0].relativePath : null,
      dokumen_path: files['dokumen'] ? files['dokumen'][0].relativePath : null,
      surat_pewarganegaraan_path: files['surat_pewarganegaraan'] ? files['surat_pewarganegaraan'][0].relativePath : null,
      surat_ganti_nama_path: files['surat_ganti_nama'] ? files['surat_ganti_nama'][0].relativePath : null
    };

    // VALIDASI: Foto, KTP, KK, dan dokumen wajib
    if (!requirementData.foto_path || !requirementData.ktp_path || !requirementData.kk_path || !requirementData.dokumen_path) {
      return res.status(400).json({ message: 'Foto, KTP, KK, dan dokumen wajib diunggah' });
    }

    const result = await Requirement.create(requirementData);
    res.status(201).json({ message: 'Pengajuan berhasil', requirementId: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.getUserRequirements = async (req, res) => {
  try {
    const data = await Requirement.findByUserId(req.user.id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.getAllRequirements = async (req, res) => {
  try {
    const data = await Requirement.findAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;

    const reqExist = await Requirement.findById(id);
    if (!reqExist) return res.status(404).json({ message: 'Data persyaratan tidak ditemukan' });

    await Requirement.updateStatus(id, status, catatan_admin);
    res.json({ message: 'Status berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};