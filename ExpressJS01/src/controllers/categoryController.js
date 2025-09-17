const { 
    getAllCategoriesService, 
    getCategoryByIdService, 
    createCategoryService 
} = require('../services/categoryService');

const getAllCategories = async (req, res) => {
    const data = await getAllCategoriesService();
    return res.status(200).json(data);
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const data = await getCategoryByIdService(id);
    return res.status(200).json(data);
};

const createCategory = async (req, res) => {
    const { name, description, image } = req.body;
    const data = await createCategoryService(name, description, image);
    return res.status(200).json(data);
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory
};


