const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getUserOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// User routes
router.post('/', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/:orderId/cancel', protect, cancelOrder);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);
router.put('/admin/:orderId', protect, admin, updateOrderStatus);

module.exports = router;
