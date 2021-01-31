const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');

const { upload } = require('../helpers/cloudinaryHelpers');
const { sendEmail } = require('../helpers/emailerHelpers');
const { imageFormarter } = require('../utils/formatters');
const { verifyToken } = require('../helpers/jwtHelpers');

const confirmUser = asyncHandler(async (req, res) => {
    const token = req.params.token;

    try {
        const decoded = verifyToken(token);
        const decodedUser = decoded.user;

        const user = await User.findById(decodedUser);

        if (user && !user.confirmed) {
            user.confirmed = true;
            user.save();
            res.send('Your account is verified.')
        } else {
            res.send('Invalid token.')
        }
    } catch (err) {
        res.send('Invalid token.')
    }
})

const registerUser = asyncHandler(async (req, res) => {
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
        let avatar = {};

        if (req.file) {
            avatar = imageFormarter(req.file, req);

            try {
                const result = await upload(avatar.url);
                avatar['url'] = result;
    
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

                const sent = await sendEmail(createdUser);
        
                if (sent) {
                    res.status(201);
                    res.json({
                        message: 'We already sent you email verification.'
                    })
                } else {
                    console.log(sent)
                }
            } catch (err) {
                console.log(err)
            }
               
            
        } else { 
            const createdUser = await User.create({
                age,
                birthday,
                email,
                firstname,
                lastname,
                password,
                username
            })

            const sent = await sendEmail(createdUser);
        
            if (sent) {
                res.status(201);
                res.json({
                    message: 'We already sent you email verification.'
                })
            } else {
                console.log(sent)
            }
        }
    } else {
        res.status(400);
        throw new Error('User is already exists.')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.checkPassword(password)) && user.confirmed) {
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
        throw new Error(user?.confirmed ? 'Invalid credentials.' : 'Your account is not yet verified.');
    }
})

module.exports = {
    confirmUser,
    loginUser,
    registerUser
}