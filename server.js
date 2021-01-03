const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connect = require('./backend/config/db');
const { errorHandler } = require('./backend/middleware/errorMiddleware');
const userRoute = require('./backend/routes/userRoutes')

dotenv.config();

connect();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.send('Api is runing');
});

app.use('/api/users', userRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`App is runing at port ${PORT}`));