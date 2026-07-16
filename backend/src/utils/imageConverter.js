const fs = require('fs');
const path = require('path');

// Cache for converted images to avoid re-reading files
const imageCache = {};

const convertImagePathToBase64 = (imagePath) => {
    return imagePath;
};

const normalizeProductImages = (product) => {
    if (!product) return product;

    const productObj = product.toJSON ? product.toJSON() : { ...product };

    // Convert main image
    if (productObj.image) {
        productObj.image = convertImagePathToBase64(productObj.image);
    }

    // Convert additional images
    if (productObj.additionalImages && Array.isArray(productObj.additionalImages)) {
        productObj.additionalImages = productObj.additionalImages.map(img =>
            convertImagePathToBase64(img)
        );
    }

    return productObj;
};

const normalizeProductsArray = (products) => {
    if (!Array.isArray(products)) return products;
    return products.map(normalizeProductImages);
};

module.exports = {
    convertImagePathToBase64,
    normalizeProductImages,
    normalizeProductsArray,
    imageCache
};
