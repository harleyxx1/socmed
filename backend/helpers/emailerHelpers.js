const nodemailer = require('nodemailer');
const { emailSign } = require('../helpers/jwtHelpers');

const sender = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILER_EMAIL,
            pass: process.env.EMAILER_PASSWORD
        }
    })
}

const mailOption = (email, token) => {
    const url = process.env.NODE_ENV === 'development' ? `${process.env.DEVELOPMENT_URL}/${token}` : `${process.env.PRODUCTION_URL}/${token}`

    return {
        from: process.env.EMAILER_FROM_EMAIL,
        to: email,
        subject: "Email Confirmation",
        text: `Please click the link to verity your account\n\nConfirm url: ${url}`
    }
}

const sendEmail = async (user) => {
    const token = await emailSign(user);

    if (token) {
        return new Promise((resolve, reject) => {
            sender().sendMail(mailOption(user.email, token), (err, data) => {
                if (err) { 
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
        
    }
}


module.exports = {
    sendEmail
}