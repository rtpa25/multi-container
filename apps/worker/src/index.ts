import { Redis } from 'ioredis';
import { keys } from './keys';
import { fib } from './utils/math';

//#region  //*=========== Redis Config ===========
const sub = new Redis({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
});
const client = new Redis({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
});
//#endregion  //*======== Redis Config ===========

//#region  //*=========== Subscriber to compute ===========
sub.subscribe(keys.redisPublisherChannel, (err, cnt) => {
    if (err) {
        console.error('Error subscribing to channel:', err);
    } else {
        console.log(
            'Subscribed to channel:',
            keys.redisPublisherChannel,
            'with count:',
            cnt,
        );
    }
});

sub.on('message', async (channel, message) => {
    try {
        if (channel === keys.redisPublisherChannel) {
            console.log('Received message from channel:', channel);

            // message will be the index of the fibonacci number to calculate
            await client.hset(
                keys.redisHashMapName,
                message,
                fib(parseInt(message)).toString(),
            );
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});
//#endregion  //*======== Subscriber to compute ===========

