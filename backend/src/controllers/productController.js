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

        const fetchProductsWithFallback = async (options) => {
            try {
                return await Product.findAll(options);
            } catch (queryErr) {
                console.error('Fetch with reviews failed, attempting simple query:', queryErr.message);
                const simpleOptions = { order: [['createdAt', 'DESC']] };
                if (options.limit) simpleOptions.limit = options.limit;
                if (options.offset) simpleOptions.offset = options.offset;
                return await Product.findAll(simpleOptions);
            }
        };

        // Only apply pagination if page/limit params are provided
        if (req.query.page && req.query.limit) {
            const pageNum = parseInt(req.query.page) || 1;
            const limitNum = parseInt(req.query.limit) || 12;
            const offsetNum = (pageNum - 1) * limitNum;
            queryOptions.limit = limitNum;
            queryOptions.offset = offsetNum;

            const totalCount = await Product.count();
            let products = await fetchProductsWithFallback(queryOptions);
            products = normalizeProductsArray(products);
            const totalPages = Math.ceil(totalCount / limitNum);

            const responseData = { 
                success: true, 
                products,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    itemsPerPage: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
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
        let products = await fetchProductsWithFallback(queryOptions);
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
        console.error('getAllProducts error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
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
