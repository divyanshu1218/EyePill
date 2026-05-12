const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

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

        // Redirect to frontend with token
        // Note: In production, consider a safer way to pass the token than query params
        res.redirect(`http://localhost:3000/login?token=${token}&user=${JSON.stringify({
            _id: req.user.id,
            username: req.user.username,
            email: req.user.email
        })}`);
    }
);


module.exports = router;
