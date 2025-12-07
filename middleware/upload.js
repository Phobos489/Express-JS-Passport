// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure that upload folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/lainnya';

    if (file.fieldname === 'ktp') folder = 'uploads/ktp';
    else if (file.fieldname === 'kk') folder = 'uploads/kk';
    else if (file.fieldname === 'dokumen') folder = 'uploads/dokumen';
    else if (file.fieldname === 'surat_pewarganegaraan') folder = 'uploads/surat_pewarganegaraan';
    else if (file.fieldname === 'surat_ganti_nama') folder = 'uploads/surat_ganti_nama';

    const uploadPath = path.join(__dirname, '..', folder);
    ensureDir(uploadPath);

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);

    // Simpan path relatif untuk database
    file.relativePath = `uploads/${file.fieldname}/${filename}`;

    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (ext && mimetype) cb(null, true);
  else cb(new Error('Hanya file JPG, PNG, dan PDF yang diperbolehkan'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
