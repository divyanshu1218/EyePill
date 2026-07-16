const { Sequelize, DataTypes } = require('sequelize');

const localSequelize = new Sequelize('eyesome_db', 'root', 'divyanshupeswani@1', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const Product = localSequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    additionalImages: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }
}, { timestamps: true });

async function checkImages() {
    try {
        await localSequelize.authenticate();
        const products = await Product.findAll({ raw: true });
        console.log("Local Database Product Images:");
        products.forEach(p => {
            console.log(`Product ID: ${p.id} | Name: ${p.name}`);
            console.log(`  image: ${p.image}`);
            console.log(`  additionalImages:`, p.additionalImages);
            console.log("---");
        });
        process.exit(0);
    } catch (e) {
        console.error("Failed to query:", e);
        process.exit(1);
    }
}

checkImages();
