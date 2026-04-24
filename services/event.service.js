const eventRepository = require('../repositories/event.repository');

class EventService {
  async getAllEvents(userId) {
    return await eventRepository.findAllByUser(userId);
  }

  async getEventById(id, userId) {
    const event = await eventRepository.findById(id, userId);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async createEvent(data, userId) {
    return await eventRepository.create({ ...data, user: userId });
  }

  async updateEvent(id, userId, data) {
    const event = await eventRepository.update(id, userId, data);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async deleteEvent(id, userId) {
    const event = await eventRepository.delete(id, userId);
    if (!event) throw new Error('Event not found');
    return event;
  }
}

module.exports = new EventService();
