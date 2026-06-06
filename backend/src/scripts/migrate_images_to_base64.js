const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');
const Product = require('../models/Product');

const uploadsDir = path.join(__dirname, '../../public/uploads');

const convertImageToBase64 = (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error converting ${filePath}:`, error.message);
        return null;
    }
};

const migrateImagesToBase64 = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Get all products
        const products = await Product.findAll({ raw: true });
        console.log(`📦 Found ${products.length} products`);

        let updated = 0;
        let skipped = 0;

        for (const product of products) {
            // Convert main image
            if (product.image && product.image.startsWith('/uploads/')) {
                const fileName = path.basename(product.image);
                const filePath = path.join(uploadsDir, fileName);
                
                if (fs.existsSync(filePath)) {
                    const base64 = convertImageToBase64(filePath);
                    if (base64) {
                        await Product.update(
                            { image: base64 },
                            { where: { id: product.id } }
                        );
                        console.log(`✏️  Product ${product.id}: Converted main image`);
                        updated++;
                    }
                } else {
                    console.warn(`⚠️  File not found: ${filePath}`);
                    skipped++;
                }
            } else if (product.image && product.image.startsWith('data:')) {
                console.log(`⏭️  Product ${product.id}: Already base64`);
            }

            // Convert additional images
            if (product.additionalImages && Array.isArray(product.additionalImages)) {
                const convertedAdditional = [];
                let hasChanges = false;

                for (const imgPath of product.additionalImages) {
                    if (imgPath.startsWith('/uploads/')) {
                        const fileName = path.basename(imgPath);
                        const filePath = path.join(uploadsDir, fileName);
                        
                        if (fs.existsSync(filePath)) {
                            const base64 = convertImageToBase64(filePath);
                            if (base64) {
                                convertedAdditional.push(base64);
                                hasChanges = true;
                            } else {
                                convertedAdditional.push(imgPath);
                            }
                        } else {
                            console.warn(`⚠️  File not found: ${filePath}`);
                            convertedAdditional.push(imgPath);
                        }
                    } else {
                        convertedAdditional.push(imgPath);
                    }
                }

                if (hasChanges) {
                    await Product.update(
                        { additionalImages: JSON.stringify(convertedAdditional) },
                        { where: { id: product.id } }
                    );
                    console.log(`✏️  Product ${product.id}: Converted additional images`);
                    updated++;
                }
            }
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`📊 Updated: ${updated}, Skipped: ${skipped}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateImagesToBase64();
