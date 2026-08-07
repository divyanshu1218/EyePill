const { CartItem, WishlistItem, Product } = require('../models/associations');
const { normalizeProductImages, normalizeProductsArray } = require('../utils/imageConverter');
const { fallbackProducts, fallbackCart, fallbackWishlist } = require('../utils/fallbackStore');

// @desc    Get user cart
// @route   GET /api/user/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });

        let formattedCart = cartItems.map(item => ({
            ...(item.Product ? item.Product.toJSON() : {}),
            qty: item.qty,
            cartItemId: item.id
        }));

        formattedCart = normalizeProductsArray(formattedCart);
        res.json({ success: true, cart: formattedCart });
    } catch (error) {
        console.error('getCart fallback:', error.message);
        res.json({ success: true, cart: fallbackCart });
    }
};

// @desc    Add product to cart
// @route   POST /api/user/cart
// @access  Private
const addToCart = async (req, res) => {
    const { product } = req.body || {};
    if (!product || !product.id) {
        return res.status(400).json({ success: false, message: 'Invalid product data' });
    }

    try {
        let cartItem = await CartItem.findOne({
            where: { userId: req.user.id, productId: product.id }
        });

        if (cartItem) {
            cartItem.qty += 1;
            await cartItem.save();
        } else {
            await CartItem.create({
                userId: req.user.id,
                productId: product.id,
                qty: product.qty || 1
            });
        }

        let updatedCart = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });

        updatedCart = updatedCart.map(item => ({
            ...(item.Product ? item.Product.toJSON() : product),
            qty: item.qty
        }));

        updatedCart = normalizeProductsArray(updatedCart);
        res.status(201).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('addToCart fallback:', error.message);
        const existing = fallbackCart.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            const prodDetail = fallbackProducts.find(p => p.id === product.id) || product;
            fallbackCart.push({ ...prodDetail, qty: 1 });
        }
        res.status(201).json({ success: true, cart: fallbackCart });
    }
};

// @desc    Update cart item quantity
// @route   POST /api/user/cart/:productId
// @access  Private
const updateCartQty = async (req, res) => {
    const { action } = req.body || {};
    try {
        const cartItem = await CartItem.findOne({
            where: { userId: req.user.id, productId: req.params.productId }
        });

        if (cartItem) {
            if (action && action.type === 'increment') {
                cartItem.qty += 1;
            } else if (action && action.type === 'decrement' && cartItem.qty > 1) {
                cartItem.qty -= 1;
            }
            await cartItem.save();
        }
        res.json({ success: true });
    } catch (error) {
        console.error('updateCartQty fallback:', error.message);
        res.json({ success: true });
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

        let updatedCart = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });

        updatedCart = updatedCart.map(item => ({
            ...(item.Product ? item.Product.toJSON() : {}),
            qty: item.qty
        }));

        updatedCart = normalizeProductsArray(updatedCart);
        res.json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('removeFromCart fallback:', error.message);
        const prodId = parseInt(req.params.productId);
        const index = fallbackCart.findIndex(i => i.id === prodId);
        if (index > -1) fallbackCart.splice(index, 1);
        res.json({ success: true, cart: fallbackCart });
    }
};

// Wishlist Handlers
const getWishlist = async (req, res) => {
    try {
        const items = await WishlistItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });
        let wishlist = items.map(i => i.Product).filter(Boolean);
        wishlist = normalizeProductsArray(wishlist);
        res.json({ success: true, wishlist });
    } catch (error) {
        console.error('getWishlist fallback:', error.message);
        res.json({ success: true, wishlist: fallbackWishlist });
    }
};

const addToWishlist = async (req, res) => {
    const { product } = req.body || {};
    try {
        if (product && product.id) {
            await WishlistItem.findOrCreate({
                where: { userId: req.user.id, productId: product.id }
            });
        }
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('addToWishlist fallback:', error.message);
        if (product && !fallbackWishlist.find(i => i.id === product.id)) {
            const prodDetail = fallbackProducts.find(p => p.id === product.id) || product;
            fallbackWishlist.push(prodDetail);
        }
        res.status(201).json({ success: true });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        await WishlistItem.destroy({
            where: { userId: req.user.id, productId: req.params.productId }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('removeFromWishlist fallback:', error.message);
        const prodId = parseInt(req.params.productId);
        const index = fallbackWishlist.findIndex(i => i.id === prodId);
        if (index > -1) fallbackWishlist.splice(index, 1);
        res.json({ success: true });
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
