// Middleware/MulterMiddleware.js
const multer = require('multer');
const { bucket } = require('../Config/firebaseAdmin');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadToFirebase = async (req, res, next) => {
  try {
    // Handle single file (for carousel, gallery)
    if (req.file) {
      const fileName = `uploads/${Date.now()}_${req.file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });

      await fileUpload.makePublic();
      req.file.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }
    
    // Handle multiple files (for events)
    if (req.files && req.files.length > 0) {
      const promises = req.files.map(async (file) => {
        const fileName = `events/${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: { contentType: file.mimetype }
        });

        await fileUpload.makePublic();
        file.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      });

      await Promise.all(promises);
    }
    
    next();
  } catch (err) {
    console.error('Firebase upload error:', err);
    res.status(500).json({ error: 'Image upload failed: ' + err.message });
  }
};

module.exports = { upload, uploadToFirebase };