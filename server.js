const express = require('express');
const dotenv = require('dotenv');

const connect = require('./backend/config/db');
const cloudinaryConnect = require('./backend/config/cloudinary');
const userRoutes = require('./backend/routes/userRoutes');
const postRoutes = require('./backend/routes/postRoutes');
const commentRoutes = require('./backend/routes/commentRoutes');
const Socket = require('./backend/classes/SocketIO');

const { errorHandler } = require('./backend/middleware/errorMiddlewares');

dotenv.config();

/**
 * This is responsible for connecting server to mongo db.
 */
connect();

/**
 * This is responsible for connecting server to cloudinary.
 */
cloudinaryConnect();

/**
 * Initializing express app.
 */
const app = express();

/**
 * Socket.io initialization.
 */
const socketIO = new Socket(app);
const http = socketIO.getHttp();

/**
 * Socket.io connecting the user.
 */
socketIO.connect()

app.use(express.json());

app.use(express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Api is running')
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
http.listen(PORT, console.log(`App is runing at port ${PORT}`));