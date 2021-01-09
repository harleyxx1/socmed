const express = require('express');
const dotenv = require('dotenv');

const connect = require('./backend/config/db');
const { errorHandler } = require('./backend/middleware/errorMiddlewares');
const cloudinaryConnect = require('./backend/config/cloudinary');
const userRoutes = require('./backend/routes/userRoutes');
const postRoutes = require('./backend/routes/postRoutes');
const commentRoutes = require('./backend/routes/commentRoutes');

dotenv.config();

connect();
cloudinaryConnect();

const app = express();

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
app.listen(PORT, console.log(`App is runing at port ${PORT}`));