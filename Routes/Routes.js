// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../Controller/AuthController');
const { verifyToken, requireAdmin } = require('../Middleware/authMiddleware');
const EventController = require('../Controller/EventController');
const { upload, uploadToFirebase } = require('../Middleware/MulterMiddleware');
const GalleryController = require('../Controller/GalleryController');

router.post('/login', AuthController.login);

router.post('/admin/events', upload.array('images', 3), uploadToFirebase, EventController.addEvent);
router.put('/admin/events/:id', upload.array('images', 3), uploadToFirebase, EventController.updateEvent);
router.post('/admin/upcoming', EventController.addUpcomingEvent);
router.get('/admin/getallevents', EventController.getAllEvents);
router.get('/admin/getupcoming', EventController.getAllUpcoming);
router.put('/admin/upcoming/:id', EventController.updateUpcomingEvent);
router.delete('/admin/events/:id', EventController.deleteEvent);
router.delete('/admin/upcoming/:id', EventController.deleteUpcomingEvent);

// CAROUSEL ROUTES (Max 3 slides)
router.post('/admin/carousel', upload.single('image'), uploadToFirebase, GalleryController.addCarousel);
router.get('/admin/carousel', GalleryController.getCarousel);
router.put('/admin/carousel/:id', upload.single('image'), uploadToFirebase, GalleryController.updateCarousel);
router.delete('/admin/carousel/:id', GalleryController.deleteCarousel);

// GALLERY ROUTES (Max 8 images)
router.post('/admin/gallery', upload.single('image'), uploadToFirebase, GalleryController.addGallery);
router.get('/admin/gallery', GalleryController.getGallery);
router.put('/admin/gallery/:id', upload.single('image'), uploadToFirebase, GalleryController.updateGallery);
router.delete('/admin/gallery/:id', GalleryController.deleteGallery);

module.exports = router;