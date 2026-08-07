const express = require('express');
require('mysql2'); // Force Vercel to bundle the mysql2 driver
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const passport = require('passport'); 
// const cookieSession = require('cookie-session'); // For Google Auth later
const { sequelize } = require('./config/db');
require('./models/associations'); // Load associations
require('./config/passport'); // Import passport config
const { redisClient } = require('./config/redis'); // For Redis later
const { generalLimiter, authLimiter, orderLimiter, searchLimiter } = require('./middleware/rateLimiter');

// Custom XSS sanitizer (xss-clean is incompatible with Express 5)
const sanitize = (obj) => {
    if (typeof obj === 'string') return obj.replace(/[<>]/g, c => c === '<' ? '&lt;' : '&gt;');
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) obj[key] = sanitize(obj[key]);
    }
    return obj;
};
const xssSanitize = (req, res, next) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.params) req.params = sanitize(req.params);
    next();
};

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Trust Vercel's reverse proxy for correct https protocol resolution
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for images
    contentSecurityPolicy: false // Disable CSP for dev (enable in prod)
}));

// Core Middleware
app.use(express.json({ limit: '10mb' }));
app.use(xssSanitize); // Sanitize body & params (placed after JSON parser)
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(passport.initialize());

// Rate Limiting
app.use('/api/', generalLimiter);  // Apply general limiter to all API routes

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authLimiter, authRoutes);        // Strict rate limit on auth
app.use('/api/products', searchLimiter, productRoutes); // Search rate limit
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);     // Order rate limit


// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Connection and Sync
const Product = require('./models/Product');
const initialProducts = [
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

sequelize.authenticate()
    .then(async () => {
        console.log('MySQL Connected');
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('Database Synced (altered)');
        } else {
            await sequelize.sync();
            console.log('Database Synced (safe)');
        }

        // Auto-seed sample products if database is empty
        try {
            const count = await Product.count();
            if (count === 0) {
                await Product.bulkCreate(initialProducts);
                console.log('Auto-seeded initial product catalog!');
            }
        } catch (seedErr) {
            console.error('Auto-seeding check failed:', seedErr.message);
        }
    })
    .catch(err => console.log('MySQL Connection Error:', err.message));


// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
