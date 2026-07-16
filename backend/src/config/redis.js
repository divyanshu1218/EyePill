const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

let redisClient = null;
let isRedisEnabled = false;

if (process.env.REDIS_URL) {
    redisClient = redis.createClient({
        url: process.env.REDIS_URL,
        disableOfflineQueue: true,
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 5) return new Error('Redis max retries reached');
                return 1000;
            }
        }
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    // Connect to Redis when the module is required
    (async () => {
        try {
            await redisClient.connect();
            console.log('Redis Connected');
            isRedisEnabled = true;
        } catch (err) {
            console.error('Redis Connection Error:', err);
        }
    })();
} else {
    console.log('Redis is disabled (REDIS_URL is not set)');
}

module.exports = {
    redisClient,
    isRedisEnabled: () => isRedisEnabled
};
