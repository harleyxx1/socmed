const express = require('express');
const multer = require('multer');

const {
    confirmUser,
    registerUser, 
    loginUser
} = require('../controllers/userControllers');

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

router.route('/confirmuser/:token').get(confirmUser);
router.route('/register').post(upload.single('avatar'), registerUser)
router.route('/login').post(loginUser);

module.exports = router;