const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    postText: {
        type: String,
        required: true
    },
    postImage: {
        type: Array
    },
    comments: {
        type: Array,
        ref: 'Comment',
    }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post