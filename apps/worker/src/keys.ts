export const keys = {
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || '6379',
    redisHashMapName: process.env.REDIS_DB_NAME || 'values',
    redisPublisherChannel: process.env.REDIS_PUBLISHER_CHANNEL || 'insert',
};

