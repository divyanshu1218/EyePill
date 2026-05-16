const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
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
            newPrice: newPrice || price,
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

        // If newPrice is empty or not provided, default to price
        if (!req.body.newPrice || req.body.newPrice === "") {
            updateData.newPrice = req.body.price || product.price;
        }

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

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard-metrics
// @access  Private/Admin
const getDashboardMetrics = async (req, res) => {
    try {
        // Total users count
        const totalUsers = await User.count();
        
        // Total products count
        const totalProducts = await Product.count();
        
        // Total orders count
        const totalOrders = await Order.count();
        
        // Revenue calculation (sum of all delivered orders)
        const revenueResult = await Order.findAll({
            attributes: [
                [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalRevenue']
            ],
            where: {
                orderStatus: 'DELIVERED'
            },
            raw: true
        });
        
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        
        // Pending orders count
        const pendingOrders = await Order.count({
            where: { orderStatus: 'PENDING' }
        });
        
        // Confirmed orders count
        const confirmedOrders = await Order.count({
            where: { orderStatus: 'CONFIRMED' }
        });
        
        // Shipped orders count
        const shippedOrders = await Order.count({
            where: { orderStatus: 'SHIPPED' }
        });
        
        // Delivered orders count
        const deliveredOrders = await Order.count({
            where: { orderStatus: 'DELIVERED' }
        });
        
        // Low stock products (qty < 5)
        const lowStockProducts = await Product.count({
            where: {
                qty: {
                    [require('sequelize').Op.lt]: 5
                }
            }
        });
        
        res.json({
            success: true,
            metrics: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: parseFloat(totalRevenue).toFixed(2),
                pendingOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                lowStockProducts
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getDashboardMetrics
};
