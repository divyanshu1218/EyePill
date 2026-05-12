const express = require('express');
const router = express.Router();
const { 
    getCart, 
    addToCart, 
    updateCartQty, 
    removeFromCart,
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Cart routes
router.route('/cart').get(protect, getCart).post(protect, addToCart);
router.route('/cart/:productId').post(protect, updateCartQty).delete(protect, removeFromCart);

// Wishlist routes
router.route('/wishlist').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/wishlist/:productId').delete(protect, removeFromWishlist);

module.exports = router;
