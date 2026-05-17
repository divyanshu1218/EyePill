const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/db');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = process.env.ADMIN_EMAIL || 'admin@eyepill.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const username = process.env.ADMIN_USERNAME || 'admin_eyepill';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                username,
                email,
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: 'EyePill'
            }
        });

        if (!created) {
            await user.update({ password: hashedPassword, role: 'admin' });
            console.log(`Admin user '${username}' (${email}) updated successfully.`);
        } else {
            console.log(`New Admin user '${username}' (${email}) created successfully.`);
        }

        process.exit();
    } catch (err) {
        console.error('Error resetting admin:', err);
        process.exit(1);
    }
};

resetAdmin();
