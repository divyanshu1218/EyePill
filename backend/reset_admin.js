const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/db');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = 'divyanshu@gmail.com';
        const password = 'admin123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                username: 'divyanshudivyanshu',
                email,
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: 'EyePill'
            }
        });

        if (!created) {
            await user.update({ password: hashedPassword, role: 'admin' });
            console.log('Admin password updated to: admin123');
        } else {
            console.log('New Admin created with password: admin123');
        }

        process.exit();
    } catch (err) {
        console.error('Error resetting admin:', err);
        process.exit(1);
    }
};

resetAdmin();
