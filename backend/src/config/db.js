const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let sequelize;

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
const isLocalDbHost = !process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
const isRenderCloud = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID || process.env.VERCEL || process.env.NODE_ENV === 'production');

// Use SQLite fallback when running on Render/cloud OR when no remote MySQL host is configured
const useSqlite = process.env.USE_SQLITE === 'true' || 
    (isRenderCloud && !connectionUri && isLocalDbHost) || 
    (process.env.USE_MYSQL !== 'true' && isLocalDbHost && !connectionUri);

if (useSqlite) {
    console.log('Database Engine: SQLite (embedded zero-config)');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false
    });
} else if (connectionUri) {
    console.log('Database Engine: MySQL (Connection URI)');
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
    console.log(`Database Engine: MySQL (${process.env.DB_HOST}:${process.env.DB_PORT || 3306})`);
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



