// models/Requirement.js
const db = require('../config/database');

class Requirement {
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses
      FROM requirements
    `;
    const [rows] = await db.execute(query);
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO requirements 
      (user_id, ktp_path, kk_path, dokumen_path, surat_pewarganegaraan_path, surat_ganti_nama_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.user_id,
      data.ktp_path,
      data.kk_path,
      data.dokumen_path,
      data.surat_pewarganegaraan_path,
      data.surat_ganti_nama_path
    ];

    const [result] = await db.execute(query, params);
    return result;
  }

  static async findByUserId(user_id) {
    const [rows] = await db.execute("SELECT * FROM requirements WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    return rows;
  }

  // <-- tambahkan method findAll di sini
  static async findAll() {
    const query = `
      SELECT r.*, u.nama_lengkap, u.email
      FROM requirements r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async updateStatus(id, status, catatan_admin = null) {
    const query = 'UPDATE requirements SET status = ?, catatan_admin = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, catatan_admin, id]);
    return result;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM requirements WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }
}

module.exports = Requirement;
