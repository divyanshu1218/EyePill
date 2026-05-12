const Product = require('../models/Product');
const path = require('path');

// @desc    Add new product
// @route   POST /api/admin/products
// @access  Private/Admin
const addProduct = async (req, res) => {
    const { name, brand, price, newPrice, category, gender, description, qty, trending, colors, sizes } = req.body || {};

    if (!req.body) {
        return res.status(400).json({ success: false, message: 'Request body is missing' });
    }

    try {
        let image = req.body.image;
        let additionalImages = req.body.additionalImages || [];

        if (req.files) {
            if (req.files['image']) {
                image = `/uploads/${path.basename(req.files['image'][0].path)}`;
            }
            if (req.files['additionalImages']) {
                additionalImages = req.files['additionalImages'].map(file => `/uploads/${path.basename(file.path)}`);
            }
        }

        const product = await Product.create({
            name,
            brand,
            price,
            newPrice,
            category,
            gender,
            description,
            image,
            additionalImages,
            qty,
            trending,
            colors: typeof colors === 'string' ? JSON.parse(colors) : colors,
            sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', errors: [error.message] });
    }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const { colors, sizes } = req.body;
        const updateData = { ...req.body };

        if (colors) updateData.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
        if (sizes) updateData.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

        if (req.files) {
            if (req.files['image']) {
                updateData.image = `/uploads/${path.basename(req.files['image'][0].path)}`;
            }
            if (req.files['additionalImages']) {
                const newAdditional = req.files['additionalImages'].map(file => `/uploads/${path.basename(file.path)}`);
                // Append or replace? Let's replace for simplicity in editing
                updateData.additionalImages = newAdditional;
            }
        }

        const updatedProduct = await product.update(updateData);
        res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.destroy();
        res.json({ success: true, message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct
};
