const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const passport = require('passport'); 
// const cookieSession = require('cookie-session'); // For Google Auth later
const { sequelize } = require('./config/db');
require('./models/associations'); // Load associations
require('./config/passport'); // Import passport config
// const redisClient = require('./config/redis'); // For Redis later
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
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for images
    contentSecurityPolicy: false // Disable CSP for dev (enable in prod)
}));

// Core Middleware
app.use(express.json({ limit: '10mb' }));
app.use(xssSanitize); // Sanitize body & params (placed after JSON parser)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Dynamic Frontend URL
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
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Connected');
        return sequelize.sync({ alter: true }); // Sync models (alter adds new columns)
    })
    .catch(err => console.log('MySQL Connection Error:', err));


// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
