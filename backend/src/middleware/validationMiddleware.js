const { body, validationResult, query } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validations
const validateSignup = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain letters and numbers'),
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Product validations
const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
    body('price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('newPrice')
        .isFloat({ min: 0 }).withMessage('New price must be a positive number'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    body('qty')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    handleValidationErrors
];

// Review validations
const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 3 }).withMessage('Comment must be at least 3 characters')
        .isLength({ max: 500 }).withMessage('Comment must not exceed 500 characters'),
    handleValidationErrors
];

// Address/Order validations
const validateOrderAddress = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required'),
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required'),
    body('phone')
        .trim()
        .matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone number is required'),
    body('addressLine1')
        .trim()
        .notEmpty().withMessage('Address is required'),
    body('city')
        .trim()
        .notEmpty().withMessage('City is required'),
    body('state')
        .trim()
        .notEmpty().withMessage('State is required'),
    body('zipCode')
        .trim()
        .matches(/^\d{5,6}$/).withMessage('Valid zip code is required'),
    handleValidationErrors
];

// Search pagination validations
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateProduct,
    validateReview,
    validateOrderAddress,
    validatePagination,
    handleValidationErrors
};
