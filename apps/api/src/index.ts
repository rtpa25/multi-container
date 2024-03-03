import cors from 'cors';
import express from 'express';
import { Pool, PoolClient } from 'pg';
import { keys } from './keys';
import { Redis } from 'ioredis';

//#region  //*=========== Setup Postgres ===========
const pgPool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    password: keys.pgPassword,
    port: parseInt(keys.pgPort),
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
});

pgPool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pgPool.on('connect', async (client) => {
    console.log('Connected to Postgres');
    await client.query('CREATE TABLE IF NOT EXISTS values (number INT)');
});

pgPool.on('acquire', (client) => {
    console.log('Client acquired');
});
//#endregion  //*======== Setup Postgres ===========

//#region  //*=========== Setup Redis ===========
const redis = new Redis({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
});
//#endregion  //*======== Setup Redis ===========

//#region  //*=========== Setup Server ===========
async function bootstrap() {
    const app = express();

    app.use(express.json());
    app.use(cors());

    const client = await pgPool.connect();

    //#region  //*=========== Route Handlers ===========
    app.get('/', (req, res) => {
        res.send('Hi');
    });

    app.get('/values/all', async (req, res) => {
        try {
            const values = await client.query('SELECT * from values');
            res.send(values.rows as number[]);
        } catch (error) {
            console.error(error);
            res.send({
                error: 'An error occurred while fetching the values from Postgres',
            }).status(500);
        }
    });

    app.get('/values/current', async (req, res) => {
        try {
            const values = await redis.hgetall(keys.redisHashMapName);
            res.send(values);
        } catch (error) {
            console.error(error);
            res.send({
                error: 'An error occurred while fetching the values from Redis',
            }).status(500);
        }
    });

    app.post('/values', async (req, res) => {
        try {
            const index = req.body.index;
            if (parseInt(index) > 40) {
                return res.status(422).send('Index too high');
            }

            const val = await redis.hget(keys.redisHashMapName, index);
            if (val && val !== 'Nothing yet!') {
                return res.send({
                    working: false,
                    message: 'Index already computed',
                });
            }
            await redis.hset(keys.redisHashMapName, index, 'Nothing yet!');
            // insert is the channel name
            const status = await redis.publish(
                keys.redisPublisherChannel,
                index,
            );
            console.log('status', status);

            await pgPool.query('INSERT INTO values(number) VALUES($1)', [
                index,
            ]);

            res.send({ working: true });
        } catch (error) {
            console.error(error);
            res.send({
                error: 'An error occurred while inserting the value',
            }).status(500);
        }
    });
    //#endregion  //*======== Route Handlers ===========

    app.listen(5000, () => {
        console.log('Listening on port 5000');
    });

    process.on('SIGINT', () => {
        console.log('SIGINT received');
        client.release();
        pgPool.end();
        redis.disconnect();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received');
        client.release();
        pgPool.end();
        redis.disconnect();
        process.exit(0);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        client.release();
        pgPool.end();
        redis.disconnect();
        process.exit(1);
    });
}

bootstrap();
//#endregion  //*======== Setup Server ===========

