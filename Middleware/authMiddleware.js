// Middleware/authMiddleware.js
const { admin } = require('../Config/firebaseAdmin');

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Check if user is admin (you must set this in custom claims!)
    if (!decodedToken.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { requireAdmin };