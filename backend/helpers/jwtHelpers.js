const jwt = require('jsonwebtoken');

const emailSign = async (user) => {
    const { _id } = user;

    return new Promise((res, rej) => {
        jwt.sign({ user: _id }, process.env.EMAIL_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (token) {
                res(token);
            } else {
                rej(err)

            }
        })
    })
}

const verifyToken = (token) => {
    const decode = jwt.verify(token, process.env.EMAIL_SECRET);

    return decode;
}

module.exports = {
    emailSign,
    verifyToken
}