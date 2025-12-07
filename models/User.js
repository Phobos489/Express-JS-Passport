// models/User.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon } = userData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (email, password, role, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon)
                   VALUES (?, ?, 'user', ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [email, hashedPassword, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon]);
    return result;
  }

  // Tambahkan method ini di class User (models/User.js)
  static async findAllUsers() {
    const query = `
    SELECT id, email, role, nama_lengkap, tanggal_lahir, tempat_lahir, 
           alamat, no_telepon, created_at
    FROM users 
    WHERE role = 'user'
    ORDER BY created_at DESC
  `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [rows] = await db.execute(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = `SELECT id, email, role, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon, created_at
                   FROM users WHERE id = ? LIMIT 1`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByIdWithPassword(id) {
    const query = `SELECT id, email, password, role, nama_lengkap, tanggal_lahir, tempat_lahir, alamat, no_telepon, created_at
                   FROM users WHERE id = ? LIMIT 1`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }

  static async updateProfile(id, updateData) {
    const {
      nama_lengkap,
      tanggal_lahir,
      tempat_lahir,
      alamat,
      no_telepon
    } = updateData;

    const query = `
      UPDATE users 
      SET 
        nama_lengkap = ?,
        tanggal_lahir = ?,
        tempat_lahir = ?,
        alamat = ?,
        no_telepon = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      nama_lengkap,
      tanggal_lahir,
      tempat_lahir,
      alamat,
      no_telepon,
      id
    ];

    const [result] = await db.execute(query, params);
    return result;
  }

  static async updatePassword(id, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const query = `
      UPDATE users 
      SET 
        password = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [hashedPassword, id]);
    return result;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;