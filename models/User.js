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

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
