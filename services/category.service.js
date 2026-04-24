const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  async getAllCategories(userId) {
    return await categoryRepository.findAllByUser(userId);
  }

  async getCategoryById(id, userId) {
    const category = await categoryRepository.findById(id, userId);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async createCategory(data, userId) {
    return await categoryRepository.create({ ...data, user: userId });
  }

  async updateCategory(id, userId, data) {
    const category = await categoryRepository.update(id, userId, data);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async deleteCategory(id, userId) {
    const category = await categoryRepository.delete(id, userId);
    if (!category) throw new Error('Category not found');
    return category;
  }
}

module.exports = new CategoryService();
