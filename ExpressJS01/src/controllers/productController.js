const { 
    getProductsByCategoryService, 
    getAllProductsService, 
    getProductByIdService, 
    createProductService 
} = require('../services/productService');

const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const data = await getProductsByCategoryService(categoryId, parseInt(page), parseInt(limit));
    return res.status(200).json(data);
};

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 12, search = '' } = req.query;
    
    const data = await getAllProductsService(parseInt(page), parseInt(limit), search);
    return res.status(200).json(data);
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const data = await getProductByIdService(id);
    return res.status(200).json(data);
};

const createProduct = async (req, res) => {
    const productData = req.body;
    const data = await createProductService(productData);
    return res.status(200).json(data);
};

module.exports = {
    getProductsByCategory,
    getAllProducts,
    getProductById,
    createProduct
};

