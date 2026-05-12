const { sequelize } = require('./src/config/db');
const Product = require('./src/models/Product');
const dotenv = require('dotenv');

dotenv.config();

const checkDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const count = await Product.count();
        console.log(`Total Products: ${count}`);

        if (count > 0) {
            const sample = await Product.findOne();
            console.log('Sample Product:', JSON.stringify(sample, null, 2));
        }

        process.exit();
    } catch (err) {
        console.error('Error checking DB:', err);
        process.exit(1);
    }
};

checkDb();
