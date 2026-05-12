const { Product, Review, CartItem, WishlistItem } = require('./src/models/associations');
const { sequelize } = require('./src/config/db');

async function testDelete() {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected');
        
        const product = await Product.findOne();
        if (!product) {
            console.log('No products found to delete');
            return;
        }

        console.log(`Found product: ${product.id} - ${product.name}`);
        
        await product.destroy();
        console.log(`Product ${product.id} destroyed successfully`);
        
    } catch (error) {
        console.error('Error during destroy:', error);
    } finally {
        await sequelize.close();
    }
}

testDelete();
