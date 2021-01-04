const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    let avatar;

    if (req.file) {
        avatar = req.file.path
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

        res.json({
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

    const user = await User.findOne({ email }).populate('-password');

    if (user && (await user.checkPassword(password))) {
        res.json(user)
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
})

module.exports = {
    loginUser,
    registerUser
}