const { Product, Review, User } = require('../models/associations');
const { normalizeProductImages, normalizeProductsArray } = require('../utils/imageConverter');
const { redisClient, isRedisEnabled } = require('../config/redis');

exports.getAllProducts = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const cacheKey = (page && limit) ? `products:page:${page}:limit:${limit}` : 'products:all';
        
        if (isRedisEnabled()) {
            try {
                const cachedData = await redisClient.get(cacheKey);
                if (cachedData) {
                    return res.status(200).json(JSON.parse(cachedData));
                }
            } catch (cacheErr) {
                console.error('Redis cache error:', cacheErr);
            }
        }

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
            let products = await Product.findAll(queryOptions);
            products = normalizeProductsArray(products);
            const totalPages = Math.ceil(totalCount / limit);

            const responseData = { 
                success: true, 
                products,
                pagination: {
                    currentPage: parseInt(page) || 1,
                    totalPages,
                    totalCount,
                    itemsPerPage: parseInt(limit) || 12,
                    hasNextPage: (parseInt(page) || 1) < totalPages,
                    hasPrevPage: (parseInt(page) || 1) > 1
                }
            };

            if (isRedisEnabled()) {
                try {
                    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
                } catch (cacheErr) {
                    console.error('Redis cache set error:', cacheErr);
                }
            }

            return res.status(200).json(responseData);
        }

        // No pagination — return all products
        let products = await Product.findAll(queryOptions);
        products = normalizeProductsArray(products);
        
        const responseData = { success: true, products };
        if (isRedisEnabled()) {
            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
            } catch (cacheErr) {
                console.error('Redis cache set error:', cacheErr);
            }
        }

        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const cacheKey = `product:${req.params.productId}`;
        if (isRedisEnabled()) {
            try {
                const cachedData = await redisClient.get(cacheKey);
                if (cachedData) {
                    return res.status(200).json(JSON.parse(cachedData));
                }
            } catch (cacheErr) {
                console.error('Redis cache get error:', cacheErr);
            }
        }

        let product = await Product.findByPk(req.params.productId, {
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
        product = normalizeProductImages(product);
        
        const responseData = { success: true, product };
        if (isRedisEnabled()) {
            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
            } catch (cacheErr) {
                console.error('Redis cache set error:', cacheErr);
            }
        }

        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
