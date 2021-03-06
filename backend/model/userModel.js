const mongoose =require('mongoose');
const bcryptjs =require('bcryptjs');

const userSchema = mongoose.Schema({
    age: {
        type: Number,
        required: true
    },
    avatar: {
        type: Object,
    },
    birthday: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function (enteredPass) {
    return await bcryptjs.compare(enteredPass, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;