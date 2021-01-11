const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    deleted: {
        type: Boolean,
        default: false,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    commentText: {
        type: String,
        required: true
    },
    commentImage: {
        type: Array,
    },
    commentParentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    isReply: {
        type: Boolean
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;