const cloudinary = require('cloudinary').v2;

const cloudinaryConnect = () => {
    return cloudinary.config({
        cloud_name: 'dnvkukd9f',
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
}

module.exports = cloudinaryConnect
