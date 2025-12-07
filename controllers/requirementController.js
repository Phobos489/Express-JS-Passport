// controllers/requirementController.js
const Requirement = require('../models/Requirement');

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
      ktp_path: files['ktp'] ? files['ktp'][0].relativePath : null,
      kk_path: files['kk'] ? files['kk'][0].relativePath : null,
      dokumen_path: files['dokumen'] ? files['dokumen'][0].relativePath : null,
      surat_pewarganegaraan_path: files['surat_pewarganegaraan'] ? files['surat_pewarganegaraan'][0].relativePath : null,
      surat_ganti_nama_path: files['surat_ganti_nama'] ? files['surat_ganti_nama'][0].relativePath : null
    };

    if (!requirementData.ktp_path || !requirementData.kk_path || !requirementData.dokumen_path) {
      return res.status(400).json({ message: 'KTP, KK, dan dokumen wajib diunggah' });
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

// <-- TAMBAHKAN controller untuk admin melihat semua
exports.getAllRequirements = async (req, res) => {
  try {
    const data = await Requirement.findAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// <-- update status (jika belum ada di file)
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
