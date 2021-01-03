const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    let path;

    if (req.file) {
        path = req.file.path
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
            avatar: path,
            birthday,
            email,
            firstname,
            lastname,
            password,
            username
        })

        res.json({
            age: createdUser.age,
            avatar: createdUser.avatar ? createdUser.avatar : undefined,
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
    const exists = await User.findOne({ email });

    if (exists) {
        const user = exists.select('-password');
        res.json(user)
    }
    else {
        res.status(400);
        throw new Error('Invalid credensitals.')
    }
})

module.exports = {
    loginUser,
    registerUser
}