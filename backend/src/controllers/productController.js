const { Product, Review, User } = require('../models/associations');

exports.getAllProducts = async (req, res) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Default 12 products per page
        const offset = (page - 1) * limit;

        // Get total count of products
        const totalCount = await Product.count();

        // Fetch products with pagination
        const products = await Product.findAll({
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
                }
            ],
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({ 
            success: true, 
            products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalCount: totalCount,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.productId, {
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
                }
            ]
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
