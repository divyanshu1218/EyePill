const { Category } = require('../models/associations');
const { fallbackCategories } = require('../utils/fallbackStore');

exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.findAll();
        if (!categories || categories.length === 0) {
            categories = fallbackCategories;
        }
        res.json({ success: true, categories });
    } catch (error) {
        console.error('getCategories fallback:', error.message);
        res.json({ success: true, categories: fallbackCategories });
    }
};
