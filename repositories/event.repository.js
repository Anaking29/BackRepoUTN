const Event = require('../models/Event');

class EventRepository {
  async findAllByUser(userId) {
    return await Event.find({ user: userId }).populate('category', 'name');
  }

  async findById(id, userId) {
    return await Event.findOne({ _id: id, user: userId }).populate('category', 'name');
  }

  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  async update(id, userId, updateData) {
    return await Event.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    ).populate('category', 'name');
  }

  async delete(id, userId) {
    return await Event.findOneAndDelete({ _id: id, user: userId });
  }
}

module.exports = new EventRepository();
