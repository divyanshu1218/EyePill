const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Product } = require('../models/associations');
const { sequelize } = require('../config/db');
console.log('DB Name:', process.env.DB_NAME);
console.log('DB User:', process.env.DB_USER);

const migrateData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected for migration...');
        
        // Sync new columns
        await sequelize.sync({ alter: true });
        console.log('Database schema synced...');

        // Update admin user with names
        const { User } = require('../models/associations');
        const admin = await User.findOne({ where: { role: 'admin' } });
        if (admin) {
            await admin.update({ firstName: 'Admin', lastName: 'EyePill' });
            console.log('Admin names updated...');
        }

        const products = await Product.findAll();

        for (const product of products) {
            // Add real-looking dynamic data
            const additionalImages = [product.image, product.image, product.image];
            const colors = [
                { name: "Midnight Black", code: "#000000" },
                { name: "Satin Gunmetal", code: "#4A4A4A" },
                { name: "Champagne Gold", code: "#D4AF37" }
            ];
            const sizes = ["Extra Wide", "Wide", "Medium", "Narrow"];
            const weight = Math.floor(Math.random() * 20 + 15) + "g";

            await product.update({
                additionalImages,
                colors,
                sizes,
                weight
            });
            console.log(`Updated product: ${product.name}`);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrateData();
