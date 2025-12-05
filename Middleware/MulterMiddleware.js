// Middleware/MulterMiddleware.js
const multer = require('multer');
const { bucket } = require('../Config/firebaseAdmin');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadToFirebase = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
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
    next();
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
};

module.exports = { upload, uploadToFirebase };