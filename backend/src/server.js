const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const passport = require('passport'); 
// const cookieSession = require('cookie-session'); // For Google Auth later
const { sequelize } = require('./config/db');
require('./models/associations'); // Load associations
require('./config/passport'); // Import passport config
// const redisClient = require('./config/redis'); // For Redis later


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));

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

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);


// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Connection and Sync
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Connected');
        return sequelize.sync(); // Sync models
    })
    .catch(err => console.log('MySQL Connection Error:', err));


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
