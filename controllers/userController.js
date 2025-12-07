// controllers/userController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        // Get all users except admins (optional - atau bisa include admin juga)
        const users = await User.findAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};