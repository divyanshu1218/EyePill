const { Product, Review, User } = require('./src/models/associations');
const { sequelize } = require('./src/config/db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testFetch = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');
        
        const products = await Product.findAll({
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
                }
            ]
        });
        console.log('Fetch successful, count:', products.length);
        process.exit(0);
    } catch (err) {
        console.error('Fetch failed:', err);
        process.exit(1);
    }
};

testFetch();
