const rateLimit = require('express-rate-limit');

// Shared config to disable X-Forwarded-For validation for local dev
const sharedConfig = {
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
};

// General API rate limiter
const generalLimiter = rateLimit({
    ...sharedConfig,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
    ...sharedConfig,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login/signup attempts, please try again after 15 minutes.',
    skipSuccessfulRequests: true,
});

// Order placement rate limiter
const orderLimiter = rateLimit({
    ...sharedConfig,
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: 'Too many orders placed. Please try again later.',
});

// Search rate limiter
const searchLimiter = rateLimit({
    ...sharedConfig,
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
    message: 'Too many search requests. Please try again later.',
});

module.exports = {
    generalLimiter,
    authLimiter,
    orderLimiter,
    searchLimiter
};
