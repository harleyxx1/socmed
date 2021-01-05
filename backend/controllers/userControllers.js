const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    let avatar = {};

    const hostURL = req.protocol + '://' + req.get('host') + '/'

    if (req.file) {
        avatar = {
            "originalname": req.file.originalname,
            "encoding": req.file.encoding,
            "mimetype": req.file.mimetype,
            "filename": req.file.filename,
            "size": req.file.size,
            "url": `${hostURL}${req.file.filename}`
        }
    }

    const {
        age,
        birthday,
        email,
        firstname,
        lastname,
        password,
        username
    } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
        const createdUser = await User.create({
            age,
            avatar,
            birthday,
            email,
            firstname,
            lastname,
            password,
            username
        })

        res.status(201);
        res.json({
            _id: createdUser._id,
            age: createdUser.age,
            avatar: createdUser.avatar,
            birthday: createdUser.birthday,
            email: createdUser.email,
            firstname: createdUser.firstname,
            lastname: createdUser.lastname,
            username: createdUser.username
        })
    } else {
        res.status(400);
        throw new Error('User is already exists.')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.checkPassword(password))) {
        res.json({
            _id: user._id,
            age: user.age,
            avatar: user.avatar,
            birthday: user.birthday,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username
        })
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
})

module.exports = {
    loginUser,
    registerUser
}