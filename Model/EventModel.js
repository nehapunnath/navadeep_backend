// Model/EventModel.js
const { rtdb, bucket } = require('../Config/firebaseAdmin');

class EventModel {
  static eventsRef = rtdb.ref('events');
  static upcomingRef = rtdb.ref('upcomingEvents');

  // ===================== MEMORABLE EVENTS =====================

  static async getAllEvents() {
    const snapshot = await this.eventsRef.once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }

  // Create new event
  static async createEvent(eventData) {
    const newRef = this.eventsRef.push();
    await newRef.set(eventData);
    return { id: newRef.key, ...eventData };
  }

  // Update existing event
  static async updateEvent(id, eventData) {
    await this.eventsRef.child(id).update(eventData);
    return { id, ...eventData };
  }

  // Delete event + images from storage
  static async deleteEvent(id) {
    const snapshot = await this.eventsRef.child(id).once('value');
    const event = snapshot.val();

    if (event?.images?.length > 0) {
      await Promise.all(
        event.images.map(async (url) => {
          try {
            const fileName = decodeURIComponent(url.split('/o/')[1]?.split('?')[0]);
            if (fileName) await bucket.file(fileName).delete();
          } catch (err) {
            console.warn('Failed to delete image:', url);
          }
        })
      );
    }

    await this.eventsRef.child(id).remove();
  }

  // ===================== UPCOMING EVENTS =====================

  static async getAllUpcoming() {
    const snapshot = await this.upcomingRef.once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }

  static async createUpcoming(eventData) {
    const newRef = this.upcomingRef.push();
    await newRef.set(eventData);
    return { id: newRef.key, ...eventData };
  }

  static async updateUpcoming(id, eventData) {
    await this.upcomingRef.child(id).update(eventData);
    return { id, ...eventData };
  }

  static async deleteUpcoming(id) {
    await this.upcomingRef.child(id).remove();
  }
}

module.exports = EventModel;