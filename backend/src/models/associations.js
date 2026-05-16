const User = require('./User');
const Product = require('./Product');
const CartItem = require('./CartItem');
const WishlistItem = require('./WishlistItem');
const Category = require('./Category');

// User - CartItem (1:N)
User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// Product - CartItem (1:N)
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// User - WishlistItem (1:N)
User.hasMany(WishlistItem, { foreignKey: 'userId' });
WishlistItem.belongsTo(User, { foreignKey: 'userId' });

// Product - WishlistItem (1:N)
Product.hasMany(WishlistItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId' });

const Review = require('./Review');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Product and Review
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// User and Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and Order (1:N)
User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order and OrderItem (1:N)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Product and OrderItem (1:N)
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    User,
    Product,
    CartItem,
    WishlistItem,
    Category,
    Review,
    Order,
    OrderItem
};
