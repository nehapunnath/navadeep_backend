// controllers/authController.js
const AuthModel = require('../Model/AuthModel');

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const result = await AuthModel.login(email, password);

    if (result.success) {
      return res.json({
        success: true,
        token: result.token,        // Custom token (permanent)
        uid: result.uid,
        isAdmin: result.isAdmin,
        message: result.message
      });
    } else {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }
  }

  // Optional: Get current user info
  static async me(req, res) {
    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        isAdmin: req.isAdmin || false
      }
    });
  }
}

module.exports = AuthController;