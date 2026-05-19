const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    newPrice: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: 'unisex'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    trending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    additionalImages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    colors: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    sizes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Product;
