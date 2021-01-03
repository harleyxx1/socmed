const express = require('express');
const dotenv = require('dotenv');
const connect = require('./config/db');

const userRoute = require('./routes/userRoutes')
dotenv.config();

connect()

const app = express();

app.use('/api/users', userRoute)

app.listen(5000, console.log('ahah'))