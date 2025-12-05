// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../Controller/AuthController');
const { verifyToken, requireAdmin } = require('../Middleware/authMiddleware');
const EventController = require('../Controller/EventController');
const {upload ,uploadToFirebase}= require('../Middleware/MulterMiddleware');

router.post('/login', AuthController.login);

router.post('/admin/events', upload.array('images', 3),uploadToFirebase,  EventController.addEvent);
router.put('/admin/events/:id',  upload.array('images', 3),uploadToFirebase,  EventController.updateEvent);
router.post('/admin/upcoming', EventController.addUpcomingEvent);
router.get('/admin/getallevents', EventController.getAllEvents);
router.get('/admin/getupcoming', EventController.getAllUpcoming);
router.put('/admin/upcoming/:id', EventController.updateUpcomingEvent);
router.delete('/admin/events/:id', EventController.deleteEvent);
router.delete('/admin/upcoming/:id',  EventController.deleteUpcomingEvent);

module.exports = router;