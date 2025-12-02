// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../Controller/AuthController');
const { verifyToken } = require('../Middleware/authMiddleware');

// Public routes
router.post('/login', AuthController.login);



module.exports = router;