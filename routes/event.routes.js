const express = require('express');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/event.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const Joi = require('joi');

const router = express.Router();

const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  date: Joi.date().required(),
  location: Joi.string().required(),
  category: Joi.string().required(), // Assuming category ID
});

router.use(protect);

router.route('/')
  .get(getAllEvents)
  .post(validate(eventSchema), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(validate(eventSchema), updateEvent)
  .delete(deleteEvent);

module.exports = router;
