const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllUsers
};
