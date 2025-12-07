// routes/requirements.js
const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post(
  '/submit',
  authenticate,
  authorize(['user']),
  upload.fields([
    { name: 'ktp', maxCount: 1 },
    { name: 'kk', maxCount: 1 },
    { name: 'dokumen', maxCount: 1 },
    { name: 'surat_pewarganegaraan', maxCount: 1 },
    { name: 'surat_ganti_nama', maxCount: 1 }
  ]),
  requirementController.submitRequirements
);

router.get(
  '/my-requirements',
  authenticate,
  authorize(['user']),
  requirementController.getUserRequirements
);

// ADMIN route: semua pengajuan
router.get(
  '/all',
  authenticate,
  authorize(['admin']),
  requirementController.getAllRequirements
);

// ADMIN update status
router.put(
  '/:id/status',
  authenticate,
  authorize(['admin']),
  requirementController.updateStatus
);

module.exports = router;
