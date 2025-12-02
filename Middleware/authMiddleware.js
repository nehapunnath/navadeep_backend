// middleware/authMiddleware.js
const AuthModel = require('../Model/AuthModel');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  const result = await AuthModel.verifyToken(token);
  if (!result.success) {
    return res.status(401).json({ success: false, error: 'Session expired. Please login again.' });
  }

  req.user = result.decodedToken;
  req.isAdmin = await AuthModel.isAdmin(req.user.uid);
  next();
};

const requireAdmin = async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };