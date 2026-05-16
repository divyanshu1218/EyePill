const { Review, Product, User, OrderItem, Order } = require('../models/associations');

exports.addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // Validate inputs
        if (!productId || !rating || !comment) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: productId, rating, comment' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // CHECK: User must have purchased this product
        // Find if user has a delivered order containing this product
        const purchasedItem = await OrderItem.findOne({
            where: { 
                productId: productId 
            },
            include: [
                {
                    model: Order,
                    where: { 
                        userId: userId,
                        orderStatus: 'DELIVERED' // Only delivered orders can review
                    }
                }
            ]
        });

        if (!purchasedItem) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only review products you have purchased and received' 
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            where: { 
                productId: productId,
                userId: userId
            }
        });

        if (existingReview) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already reviewed this product' 
            });
        }

        const review = await Review.create({
            productId,
            userId,
            rating,
            comment
        });

        // Recalculate product average rating
        const reviews = await Review.findAll({ where: { productId } });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
            : 0;
        
        // Use explicit set and save for reliability
        product.rating = parseFloat(avgRating.toFixed(1));
        await product.save();

        const populatedReview = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        });

        res.status(201).json({ success: true, review: populatedReview, message: 'Review added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: req.params.productId },
            include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        });
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
