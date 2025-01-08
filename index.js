const express = require('express')
const redis = require('redis')
const db = require('./lib/db')
const User = require('./module/User')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = 3000
app.use(express.json()); // This parses JSON payloads
// app.use(express.urlencoded({ extended: true })); // This parses URL-encoded payloads

const redisClient = redis.createClient({ url: process.env.REDIS_URI });

redisClient.connect()
    .then(() => console.log('Connected to Redis Cloud'))
    .catch((err) => console.error('Redis connection error:', err));


app.get('/', async (req, res) => {
    try {
        // حاول الحصول على البيانات من Redis
        const cachedData = await redisClient.get('user');
        if (cachedData) {
            return res.json(JSON.parse(cachedData)); // إرجاع البيانات المخزنة مؤقتًا
        } else {
            // إذا لم تكن البيانات موجودة، اجلبها من MongoDB
            const users = await User.find();
            await redisClient.setEx('user', 600, JSON.stringify(users)); // تخزين البيانات في Redis
            return res.json(users);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred while fetching data');
    }
});
app.post('/new', async (req, res) => {
    const info = req.body;

    if (!info.name || !info.password) {
        return res.status(400).send('Missing required fields: name or password');
    }

    try {
        const newUser = new User({
            name: info.name,
            password: info.password
        });

        await newUser.save(); // حفظ المستخدم الجديد في MongoDB

        // تحديث البيانات المخزنة في Redis
        const users = await User.find();
        await redisClient.setEx('user', 600, JSON.stringify(users));

        res.send('User saved successfully');
        console.log('User saved');
    } catch (error) {
        res.status(500).send('Error saving User');
        console.error('Error saving User:', error);
    }
});


app.get('/test-redis', async (req, res) => {
    try {
        // Set a test key in Redis
        await redisClient.set('test_key', 'Redis is working');
        
        // Get the value of the test key
        const value = await redisClient.get('test_key');
        
        if (value) {
            res.send(`Success: ${value}`);
        } else {
            res.status(500).send('Redis is not working properly');
        }
    } catch (error) {
        console.error('Error testing Redis:', error);
        res.status(500).send('Error connecting to Redis');
    }
});


app.listen(port, async () => {
    await db()
    console.log(`Example app listening on port ${port}`)
})
