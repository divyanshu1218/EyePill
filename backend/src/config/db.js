const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let sequelize;

const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL) || Boolean(process.env.RENDER);
const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

// Use SQLite fallback when deployed on Render without a remote MySQL host
const useSqlite = process.env.USE_SQLITE === 'true' || 
    (isProduction && !connectionUri && (!process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1'));

if (useSqlite) {
    console.log('Using zero-config SQLite embedded database for deployment');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false
    });
} else if (connectionUri) {
    const shouldEnableSsl = () => process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

    sequelize = new Sequelize(connectionUri, {
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            connectTimeout: 60000,
            enableKeepAlive: true,
            ...(shouldEnableSsl() ? { ssl: { require: true, rejectUnauthorized: false } } : {})
        }
    });
} else {
    const shouldEnableSsl = () => process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

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
            dialectOptions: {
                connectTimeout: 60000,
                enableKeepAlive: true,
                ...(shouldEnableSsl() ? { ssl: { require: true, rejectUnauthorized: false } } : {})
            }
        }
    );
}

module.exports = { sequelize };


