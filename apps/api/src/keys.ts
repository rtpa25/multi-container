export const keys = {
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || '6379',
    redisHashMapName: process.env.REDIS_DB_NAME || 'values',
    redisPublisherChannel: process.env.REDIS_PUBLISHER_CHANNEL || 'insert',
    pgUser: process.env.PG_USER || 'postgres',
    pgHost: process.env.PG_HOST || 'localhost',
    pgDatabase: process.env.PG_DATABASE || 'values',
    pgPassword: process.env.PG_PASSWORD || '',
    pgPort: process.env.PG_PORT || '5432',
};

