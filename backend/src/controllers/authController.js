const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please add all fields',
                errors: ['Please add all fields']
            });
        }

        // Check user exists
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists',
                errors: ['User already exists']
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const isAdminEmail = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
        const role = isAdminEmail ? 'admin' : 'user';
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ 
                success: false,
                message: 'Invalid user data',
                errors: ['Invalid user data']
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            errors: [error.message]
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
                errors: ['Please provide email and password']
            });
        }

        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Auto-promote to admin if email matches process.env.ADMIN_EMAIL
            const isAdminEmail = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
            if (isAdminEmail && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }
            res.json({
                success: true,
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ 
                success: false,
                message: 'Invalid credentials',
                errors: ['Invalid credentials']
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            errors: [error.message]
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        let user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Auto-promote to admin if email matches process.env.ADMIN_EMAIL
        const isAdminEmail = process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
        if (isAdminEmail && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { firstName, lastName, phone } = req.body;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile,
};
