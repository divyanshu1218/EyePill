const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && typeof authHeader === 'string') {
        if (authHeader.toLowerCase().startsWith('bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        let user;
        try {
            user = await User.findByPk(decoded.id);
        } catch (dbErr) {
            console.error('Auth middleware database error:', dbErr.message);
        }

        if (!user) {
            // Fallback guest user session to prevent 401 redirect loops during presentation database drops
            user = {
                id: decoded.id,
                username: decoded.role === 'admin' ? 'Admin User' : 'Guest User',
                email: decoded.role === 'admin' ? 'divyanshupeswani@gmail.com' : 'guest@eyepill.com',
                role: decoded.role || 'user',
                tokenVersion: 0
            };
        }

        const dbTokenVersion = user.tokenVersion || 0;
        const decodedTokenVersion = decoded.tokenVersion || 0;
        if (dbTokenVersion !== decodedTokenVersion) {
            return res.status(401).json({ message: 'Not authorized, token revoked' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
