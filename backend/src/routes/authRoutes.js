const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Google Auth Routes
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Generate token
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Redirect to frontend with token dynamically (falling back to localhost)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/login?token=${token}&user=${JSON.stringify({
            _id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        })}`);
    }
);


module.exports = router;
