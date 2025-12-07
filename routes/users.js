// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Admin only: Get all users
router.get(
    '/all',
    authenticate,
    authorize(['admin']),
    userController.getAllUsers
);

// Admin only: Get user by ID
router.get(
    '/:id',
    authenticate,
    authorize(['admin']),
    userController.getUserById
);

module.exports = router;