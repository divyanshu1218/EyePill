const fs = require('fs');
const path = require('path');

// Cache for converted images to avoid re-reading files
const imageCache = {};

const convertImagePathToBase64 = (imagePath) => {
    if (!imagePath || imagePath.startsWith('data:') || imagePath.startsWith('http')) {
        return imagePath;
    }

    // Check cache first
    if (imageCache[imagePath]) {
        return imageCache[imagePath];
    }

    try {
        if (imagePath.startsWith('/uploads/')) {
            const fileName = path.basename(imagePath);
            const filePath = path.join(__dirname, '../../public/uploads', fileName);
            
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                const ext = path.extname(filePath).toLowerCase().slice(1);
                const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
                const base64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
                imageCache[imagePath] = base64;
                return base64;
            }
        }
    } catch (error) {
        console.error(`Error converting image ${imagePath}:`, error.message);
    }

    // Return original if conversion fails
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
