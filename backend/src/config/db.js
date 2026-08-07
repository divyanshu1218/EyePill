const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL) || Boolean(process.env.RENDER);
const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

const shouldEnableSsl = () => {
    if (process.env.DB_SSL === 'false') return false;
    if (process.env.DB_SSL === 'true') return true;
    return isProduction && Boolean(process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1');
};

if (connectionUri) {
    sequelize = new Sequelize(connectionUri, {
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: shouldEnableSsl() ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'eyepill_db',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            dialect: 'mysql',
            logging: false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            dialectOptions: shouldEnableSsl() ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        }
    );
}

module.exports = { sequelize };

