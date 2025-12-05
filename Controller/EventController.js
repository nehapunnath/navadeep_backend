// Controller/EventController.js
const EventModel = require('../Model/EventModel');



// Add New Event
const addEvent = async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const images = req.files 
      ? req.files.map(file => file.firebaseUrl).filter(Boolean)
      : [];

    if (!title || !date || !description) {
      return res.status(400).json({ error: 'Title, date, and description are required' });
    }

    const eventData = { title, date, description, images };
    const savedEvent = await EventModel.createEvent(eventData);

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event' });
  }
};

// Update Existing Event (same function, uses req.params.id)
const updateEvent = async (req, res) => {
  try {
    const { title, date, description } = req.body;
   const images = req.files 
      ? req.files.map(file => file.firebaseUrl).filter(Boolean)
      : [];

    if (!title || !date || !description) {
      return res.status(400).json({ error: 'Title, date, and description are required' });
    }

    const eventData = { title, date, description, images };
    const updatedEvent = await EventModel.updateEvent(req.params.id, eventData);

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete Event (deletes images too)
const deleteEvent = async (req, res) => {
  try {
    await EventModel.deleteEvent(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// Get All Memorable Events
const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ──────────────────────────────────────────────
// UPCOMING EVENTS (no images)
// ──────────────────────────────────────────────

const addUpcomingEvent = async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const eventData = { title, date };
    const savedEvent = await EventModel.createUpcoming(eventData);

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error adding upcoming event:', error);
    res.status(500).json({ error: 'Failed to add upcoming event' });
  }
};

const updateUpcomingEvent = async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const eventData = { title, date };
    const updatedEvent = await EventModel.updateUpcoming(req.params.id, eventData);

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating upcoming event:', error);
    res.status(500).json({ error: 'Failed to update upcoming event' });
  }
};

const deleteUpcomingEvent = async (req, res) => {
  try {
    await EventModel.deleteUpcoming(req.params.id);
    res.json({ message: 'Upcoming event deleted successfully' });
  } catch (error) {
    console.error('Error deleting upcoming event:', error);
    res.status(500).json({ error: 'Failed to delete upcoming event' });
  }
};

const getAllUpcoming = async (req, res) => {
  try {
    const events = await EventModel.getAllUpcoming();
    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
};

// ──────────────────────────────────────────────
// EXPORT ALL
// ──────────────────────────────────────────────

module.exports = {
  // Memorable Events
  addEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,

  // Upcoming Events
  addUpcomingEvent,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  getAllUpcoming
};