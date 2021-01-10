const cloudinary = require('cloudinary').v2;

const upload = (path) => {
    if (path) {
        return new Promise((res, rej) => {
            cloudinary.uploader.upload(path, function(error, response) {
                if (error) {
                    rej(error);
                } else {
                    res(response.secure_url);
                }
            })
        })
    }
}

module.exports = {
    upload
}