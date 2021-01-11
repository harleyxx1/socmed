const express = require('express');
const multer = require('multer');
const {
    getAllPosts,
    getUserPosts,
    submitPost,
    updatePost,
    deletePost
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
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: filter
});

router.route('/').get(getAllPosts)
router.route('/deletepost').post(deletePost)
router.route('/submitpost').post(upload.array('postImage', 20), submitPost)
router.route('/updatepost').post(upload.array('postImage', 20), updatePost)
router.route('/userpost').post(getUserPosts)

module.exports = router