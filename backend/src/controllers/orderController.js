const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order, OrderItem, CartItem, Product } = require('../models/associations');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Generate unique order number
const generateOrderNumber = () => {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, zipCode, country, paymentMethod, cartItems } = req.body;

        // Validate required fields
        if (!firstName || !email || !phone || !addressLine1 || !city || !state || !zipCode || !cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Calculate total amount
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.newPrice * item.qty;
        });

        // Create order record
        const orderNumber = generateOrderNumber();
        const order = await Order.create({
            userId: req.user.id,
            orderNumber,
            firstName,
            lastName: lastName || '',
            email,
            phone,
            addressLine1,
            addressLine2: addressLine2 || '',
            city,
            state,
            zipCode,
            country: country || 'India',
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
            orderStatus: 'PENDING'
        });

        // Create order items
        for (const item of cartItems) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.id,
                productName: item.name,
                price: item.newPrice,
                quantity: item.qty,
                totalPrice: item.newPrice * item.qty,
                selectedColor: item.selectedColor || null,
                selectedSize: item.selectedSize || null
            });
        }

        // If Razorpay, create Razorpay order
        if (paymentMethod === 'RAZORPAY') {
            try {
                const razorpayOrder = await razorpay.orders.create({
                    amount: Math.round(totalAmount * 100), // Convert to paise
                    currency: 'INR',
                    receipt: orderNumber,
                    payment_capture: 1
                });

                order.razorpayOrderId = razorpayOrder.id;
                await order.save();

                return res.status(201).json({
                    success: true,
                    order: order,
                    razorpayOrderId: razorpayOrder.id,
                    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
                    totalAmount: totalAmount,
                    orderNumber: orderNumber
                });
            } catch (razorpayError) {
                console.error('Razorpay Error:', razorpayError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create Razorpay order'
                });
            }
        }

        // For COD, clear cart and return success
        await CartItem.destroy({ where: { userId: req.user.id } });

        res.status(201).json({
            success: true,
            order: order,
            orderNumber: orderNumber,
            message: 'Order placed successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment details'
            });
        }

        // Verify signature
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Update order
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.razorpayOrderId = razorpayOrderId;
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.paymentStatus = 'COMPLETED';
        order.orderStatus = 'CONFIRMED';
        await order.save();

        // Clear cart
        await CartItem.destroy({ where: { userId: req.user.id } });

        res.json({
            success: true,
            message: 'Payment verified successfully',
            order: order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:orderId
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Can only cancel PENDING or CONFIRMED orders
        if (!['PENDING', 'CONFIRMED'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel orders that are already shipped or delivered'
            });
        }

        order.orderStatus = 'CANCELLED';
        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ADMIN ONLY ROUTES

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:orderId
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.json({
            success: true,
            message: 'Order updated successfully',
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getUserOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};
