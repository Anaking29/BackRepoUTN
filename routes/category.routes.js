const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const Joi = require('joi');

const router = express.Router();

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
});

router.use(protect);

router.route('/')
  .get(getAllCategories)
  .post(validate(categorySchema), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(validate(categorySchema), updateCategory)
  .delete(deleteCategory);

module.exports = router;
