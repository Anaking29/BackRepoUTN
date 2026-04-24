const Category = require('../models/Category');

class CategoryRepository {
  async findAllByUser(userId) {
    return await Category.find({ user: userId });
  }

  async findById(id, userId) {
    return await Category.findOne({ _id: id, user: userId });
  }

  async create(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async update(id, userId, updateData) {
    return await Category.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    );
  }

  async delete(id, userId) {
    return await Category.findOneAndDelete({ _id: id, user: userId });
  }
}

module.exports = new CategoryRepository();
