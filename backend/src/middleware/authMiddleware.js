const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && typeof authHeader === 'string') {
        const [scheme, credentials] = authHeader.split(' ');
        if (scheme && scheme.toLowerCase() === 'bearer' && credentials) {
            token = credentials;
        } else {
            return res.status(401).json({ message: 'Not authorized, invalid authorization format' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        if (typeof decoded.tokenVersion !== 'undefined' && user.tokenVersion !== decoded.tokenVersion) {
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
