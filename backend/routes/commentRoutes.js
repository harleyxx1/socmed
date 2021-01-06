const express = require('express');
const multer = require('multer');

const {
    addComment,
    addReplyComment,
    updateComment
} = require('../controllers/commentControllers');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
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
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filter
});


router.route('/submitcomment').post(upload.array('commentImage'), addComment);
router.route('/submitreply').post(upload.array('commentImage'), addReplyComment);
router.route('/updatecomment').post(upload.array('commentImage'), updateComment);

module.exports = router;