const express = require('express');
const dotenv = require('dotenv');
const connect = require('./backend/config/db');

const userRoute = require('./backend/routes/userRoutes')
dotenv.config();

connect()

const app = express();

app.get('/', (req, res) => {
    res.send('Api is runing');
})

app.use('/api/users', userRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App is runing at port ${PORT}`))