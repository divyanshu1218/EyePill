const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let sequelize;

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

// Parse DB_HOST and DB_PORT (handling autorack.proxy.rlwy.net:58952 format)
let rawHost = process.env.DB_HOST || 'localhost';
let dbPort = parseInt(process.env.DB_PORT, 10) || 3306;

if (rawHost.includes(':')) {
    const parts = rawHost.split(':');
    rawHost = parts[0];
    if (parts[1] && !isNaN(parseInt(parts[1], 10))) {
        dbPort = parseInt(parts[1], 10);
    }
}
const dbHost = rawHost;

const isLocalDbHost = !dbHost || dbHost === 'localhost' || dbHost === '127.0.0.1';
const isRenderCloud = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID || process.env.VERCEL || process.env.NODE_ENV === 'production');

const shouldEnableSsl = () => {
    if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') return true;
    if (process.env.DB_SSL === 'false' || process.env.DB_SSL === '0') return false;
    // Railway TCP proxies (rlwy.net) explicitly do NOT use SSL
    if (dbHost.includes('rlwy.net') || (connectionUri && connectionUri.includes('rlwy.net'))) return false;
    return false;
};

// Default to SQLite on Render/Cloud deployments unless USE_MYSQL=true is explicitly specified
const useSqlite = process.env.USE_SQLITE === 'true' || 
    (isRenderCloud && process.env.USE_MYSQL !== 'true');

if (useSqlite) {
    console.log('Database Engine: SQLite (embedded zero-config)');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false
    });
} else if (connectionUri) {
    console.log('Database Engine: MySQL (Connection URI)');
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
    console.log(`Database Engine: MySQL (${dbHost}:${dbPort}) SSL: ${shouldEnableSsl()}`);
    sequelize = new Sequelize(
        process.env.DB_NAME || 'eyepill_db',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: dbHost,
            port: dbPort,
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
