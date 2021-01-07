const express = require('express');
const multer = require('multer');
const {
    getAllPosts,
    getUserPosts,
    submitPost,
    updatePost
} = require('../controllers/postControllers');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.replace(/ /g, '-'))
    }
})

const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15
    },
    fileFilter: filter
});

router.route('/').get(getAllPosts)
router.route('/submitpost').post(upload.array('postImage', 20), submitPost)
router.route('/userpost').post(getUserPosts)
router.route('/updatepost').post(upload.array('postImage', 20), updatePost)

module.exports = router