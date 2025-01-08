const redis = require('redis')

const connectRedis = () => {
    try {
        const redisClient = redis.createClient({ url: process.env.REDIS_URI })
        redisClient.connect(console.log('Done connection with redis cloud'))
    } catch (error) {
        console.log(error)
    }
}
module.export = connectRedis