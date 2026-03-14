import redis from 'redis';

const redisConfig = {
    host: 'localhost',
    port: 6379,
    password: 'jiuyu',
}

// 创建redis客户端
const redisClient = redis.createClient(redisConfig)
redisClient.on('connect', () => {
    // redisClient.set('node:name', 'jiuyu-redis-node')

    // 用途就是 从 session 中获取用户信息
    // 需要将用户信息存储到 redis 中， 还需要设置过期时间为 10 s
    redisClient.set('user:123', JSON.stringify({ id: 123, name: 'jiuyu' }), { EX: 10 })

    console.log('Connected to Redis 成功');
})

// 连接redis
redisClient.connect()