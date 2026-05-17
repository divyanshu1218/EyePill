const { Product, Review, User } = require('../models/associations');

exports.getAllProducts = async (req, res) => {
    try {
        const queryOptions = {
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        // Only apply pagination if page/limit params are provided
        if (req.query.page && req.query.limit) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;
            queryOptions.limit = limit;
            queryOptions.offset = offset;

            const totalCount = await Product.count();
            const products = await Product.findAll(queryOptions);
            const totalPages = Math.ceil(totalCount / limit);

            return res.status(200).json({ 
                success: true, 
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        }

        // No pagination — return all products
        const products = await Product.findAll(queryOptions);
        res.status(200).json({ success: true, products });
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
