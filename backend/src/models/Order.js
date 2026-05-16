const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressLine1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        defaultValue: 'India'
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.ENUM('COD', 'RAZORPAY'),
        defaultValue: 'COD'
    },
    paymentStatus: {
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING'
    },
    orderStatus: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING'
    },
    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    razorpaySignature: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Order;
