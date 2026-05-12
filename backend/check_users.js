const { sequelize } = require('./src/config/db');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const users = await User.findAll();
        console.log(`Total Users: ${users.length}`);
        
        users.forEach(u => {
            console.log(`User: ${u.username} (${u.email}) - Role: ${u.role}`);
        });

        process.exit();
    } catch (err) {
        console.error('Error checking Users:', err);
        process.exit(1);
    }
};

checkUsers();
