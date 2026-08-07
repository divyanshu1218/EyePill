const { Product, Review, User } = require('../models/associations');
const { normalizeProductImages, normalizeProductsArray } = require('../utils/imageConverter');
const { redisClient, isRedisEnabled } = require('../config/redis');
const { fallbackProducts } = require('../utils/fallbackStore');

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

        let products;
        try {
            products = await Product.findAll(queryOptions);
        } catch (queryErr) {
            console.error('Database query failed, using fallback catalog:', queryErr.message);
            products = fallbackProducts;
        }

        // If database table is empty, use fallback products
        if (!products || products.length === 0) {
            products = fallbackProducts;
        }

        products = normalizeProductsArray(products);

        // Only apply pagination if page/limit params are provided
        if (req.query.page && req.query.limit) {
            const pageNum = parseInt(req.query.page) || 1;
            const limitNum = parseInt(req.query.limit) || 12;
            const offsetNum = (pageNum - 1) * limitNum;
            const totalCount = products.length;
            const paginatedProducts = products.slice(offsetNum, offsetNum + limitNum);
            const totalPages = Math.ceil(totalCount / limitNum);

            const responseData = { 
                success: true, 
                products: paginatedProducts,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    itemsPerPage: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            };

            return res.status(200).json(responseData);
        }

        const responseData = { success: true, products };
        res.status(200).json(responseData);
    } catch (err) {
        console.error('getAllProducts caught exception, returning fallback catalog:', err.message);
        res.status(200).json({ success: true, products: fallbackProducts });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        let product;
        try {
            product = await Product.findByPk(productId, {
                include: [
                    {
                        model: Review,
                        as: 'reviews',
                        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
                    }
                ]
            });
        } catch (dbErr) {
            console.error('getProductById DB error, using fallback:', dbErr.message);
            product = fallbackProducts.find(p => p.id === productId);
        }

        if (!product) {
            product = fallbackProducts.find(p => p.id === productId);
        }

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product = normalizeProductImages(product);
        res.status(200).json({ success: true, product });
    } catch (err) {
        console.error('getProductById fallback caught:', err.message);
        const fallbackProd = fallbackProducts.find(p => p.id === parseInt(req.params.productId)) || fallbackProducts[0];
        res.status(200).json({ success: true, product: fallbackProd });
    }
};
