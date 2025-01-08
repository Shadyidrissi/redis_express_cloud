const express = require('express')
const db = require('./lib/db')
const User = require('./module/User')
const redisCloud = require('./lib/redisCloud')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = 3000
app.use(express.json()); // This parses JSON payloads
// app.use(express.urlencoded({ extended: true })); // This parses URL-encoded payloads

app.get('/', async (req, res) => { 
    console.log('first')
})
app.post('/new', (req, res) => {
    const info = req.body

    if (!info.name || !info.password) {
        return res.status(400).send('Missing required fields: name or password');
    }
    const data = new User({
        name: info.name,
        password: info.password
    })
    data.save()
        .then(() => {
            res.send('User saved successfully');
            console.log('User saved');
        })
        .catch((error) => {
            res.status(500).send('Error saving User');
            console.error('Error saving User:', error);
        });
})

app.listen(port, async () => {
    await db()
    console.log(`Example app listening on port ${port}`)
})
