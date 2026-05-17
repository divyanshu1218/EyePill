const { CartItem, WishlistItem, Product } = require('../models/associations');

// @desc    Get user cart
// @route   GET /api/user/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });

        // Map to format frontend expects
        const formattedCart = cartItems.map(item => ({
            ...item.Product.toJSON(),
            qty: item.qty,
            cartItemId: item.id
        }));

        res.json({ success: true, cart: formattedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add product to cart
// @route   POST /api/user/cart
// @access  Private
const addToCart = async (req, res) => {
    const { product } = req.body;
    try {
        // Check stock
        const productRecord = await Product.findByPk(product.id);
        if (!productRecord || productRecord.qty <= 0) {
            return res.status(400).json({ success: false, message: 'Product is out of stock' });
        }

        let cartItem = await CartItem.findOne({
            where: { userId: req.user.id, productId: product.id }
        });

        if (cartItem) {
            if (cartItem.qty >= productRecord.qty) {
                return res.status(400).json({ success: false, message: 'Maximum stock reached' });
            }
            cartItem.qty += 1;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                userId: req.user.id,
                productId: product.id,
                qty: product.qty || 1
            });
        }

        const updatedCart = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });

        res.status(201).json({ 
            success: true, 
            cart: updatedCart.map(item => ({
                ...item.Product.toJSON(),
                qty: item.qty
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update cart item quantity
// @route   POST /api/user/cart/:productId
// @access  Private
const updateCartQty = async (req, res) => {
    const { action } = req.body;
    try {
        const cartItem = await CartItem.findOne({
            where: { userId: req.user.id, productId: req.params.productId }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (action.type === 'increment') {
            // Check stock before incrementing
            const productRecord = await Product.findByPk(req.params.productId);
            if (productRecord && cartItem.qty >= productRecord.qty) {
                return res.status(400).json({ success: false, message: 'Cannot exceed available stock' });
            }
            cartItem.qty += 1;
        } else if (action.type === 'decrement') {
            if (cartItem.qty > 1) {
                cartItem.qty -= 1;
            }
        }

        await cartItem.save();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Remove from cart
// @route   DELETE /api/user/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        await CartItem.destroy({
            where: { userId: req.user.id, productId: req.params.productId }
        });

        const updatedCart = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });

        res.json({ 
            success: true, 
            cart: updatedCart.map(item => ({
                ...item.Product.toJSON(),
                qty: item.qty
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Wishlist Handlers
const getWishlist = async (req, res) => {
    try {
        const items = await WishlistItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });
        res.json({ success: true, wishlist: items.map(i => i.Product) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addToWishlist = async (req, res) => {
    const { product } = req.body;
    try {
        await WishlistItem.findOrCreate({
            where: { userId: req.user.id, productId: product.id }
        });
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        await WishlistItem.destroy({
            where: { userId: req.user.id, productId: req.params.productId }
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
