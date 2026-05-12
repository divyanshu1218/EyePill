const { sequelize } = require('./config/db');
require('./models/associations');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
    {
        name: "Ardor Avaitor",
        brand: "Ray-Ban",
        price: 2499.00,
        newPrice: 1999.00,
        category: "sports",
        gender: "unisex",
        description: "Classic aviator style for the bold.",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        trending: true,
        qty: 15
    },
    {
        name: "Caper Active",
        brand: "Oakley",
        price: 1599.00,
        newPrice: 1299.00,
        category: "sports",
        gender: "men",
        description: "Active wear for high performance.",
        image: "https://images.unsplash.com/photo-1511499767390-90342f16b147?auto=format&fit=crop&q=80&w=800",
        rating: 4.5,
        trending: true,
        qty: 20
    },
    {
        name: "Alder Street",
        brand: "Fastrack",
        price: 3499.00,
        newPrice: 2999.00,
        category: "sports",
        gender: "unisex",
        description: "Street style with durability.",
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        trending: true,
        qty: 10
    },
    {
        name: "Black boss",
        brand: "Boss",
        price: 3999.00,
        newPrice: 2999.00,
        category: "sunglasses",
        gender: "men",
        description: "Premium black sunglasses.",
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        trending: true,
        qty: 8
    },
    {
        name: "Hip Hop Candy",
        brand: "Vogue",
        price: 1999.00,
        newPrice: 1499.00,
        category: "sports",
        gender: "women",
        description: "Funky and fresh design.",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
        rating: 4.3,
        trending: true,
        qty: 25
    },
    {
        name: "Punk Cut Out",
        brand: "Diesel",
        price: 3599.00,
        newPrice: 2999.00,
        category: "sunglasses",
        gender: "unisex",
        description: "Edgy cut-out frame design.",
        image: "https://images.unsplash.com/photo-1511499767390-90342f16b147?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        trending: true,
        qty: 12
    },
    {
        name: "Rounded Gold",
        brand: "Lenskart",
        price: 1799.00,
        newPrice: 1299.00,
        category: "vision",
        gender: "women",
        description: "Gold rimmed round glasses.",
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800",
        rating: 4.4,
        trending: true,
        qty: 30
    }
];

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync({ force: true });
        console.log('Database synced (force)...');
        await Product.bulkCreate(products);
        console.log('Production data imported!');
        process.exit();
    } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
    }
};

seedDatabase();
