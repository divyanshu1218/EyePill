const { Category } = require('../models/associations');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ success: true, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
