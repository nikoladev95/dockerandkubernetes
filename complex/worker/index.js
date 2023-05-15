const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

// Recursively calculate the Fibonacci value on a certain index
function fib(index) {
    if (index < 2) return 1;
    return fib(index-1) + fib(index - 2);
}

// Have Redis listen to any value and run the fib() function
// Every time we get a new message (index), run a callback function
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

// Return the value to Redis instance
sub.subscribe('insert');