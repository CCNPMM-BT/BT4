const Category = require('../models/category');

const getAllCategoriesService = async () => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        return { EC: 0, EM: 'Get categories successfully', DT: categories };
    } catch (error) {
        console.log('Error in getAllCategoriesService:', error);
        return { EC: -1, EM: 'Failed to get categories' };
    }
};

const getCategoryByIdService = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return { EC: 1, EM: 'Category not found' };
        }
        return { EC: 0, EM: 'Get category successfully', DT: category };
    } catch (error) {
        console.log('Error in getCategoryByIdService:', error);
        return { EC: -1, EM: 'Failed to get category' };
    }
};

const createCategoryService = async (name, description, image) => {
    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return { EC: 1, EM: 'Category already exists' };
        }

        const category = await Category.create({
            name,
            description,
            image
        });

        return { EC: 0, EM: 'Create category successfully', DT: category };
    } catch (error) {
        console.log('Error in createCategoryService:', error);
        return { EC: -1, EM: 'Failed to create category' };
    }
};

module.exports = {
    getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService
};
