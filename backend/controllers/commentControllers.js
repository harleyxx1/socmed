const Comment = require('../model/commentModel');
const Post = require('../model/postModel');
const ansyncHandler = require('express-async-handler');

const { imageFormarter } = require('../utils/formatters');

const addComment = ansyncHandler(async (req, res) => {
    const {
        postId,
        commentedBy,
        commentText
    } = req.body;

    const post = await Post.findById(postId);

    if (post) {
        const commentImage = [];
        
        if (req.files.length > 0) {
            req.files.forEach(file => {
                postImage.push(imageFormarter(file, req));
            })
        } 

        const comment = await Comment.create({
            postId,
            commentedBy,
            commentText,
            commentImage
        });

        if (comment) {
            post.comment.push(comment);
            post.save();
            
            res.status(201);
            res.json(comment)
        } else {
            res.status(400);
            throw new Error('Something went wrong.');
        }
    } else {
        res.status(404);
        throw new Error('Post not found.');
    }
});

const addReplyComment = ansyncHandler(async (req, res) => {
    const {
        postId,
        commentId,
        commentedBy,
        commentText
    } = req.body;

    const parentComment = await Comment.findById(commentId);

    if (parentComment) {
        const commentImage = [];
        
        if (req.files.length > 0) {
            req.files.forEach(file => {
                commentImage.push(imageFormarter(file, req))
            })
        }

        const comment = await Comment.create({
            postId,
            commentParentId: commentId,
            commentedBy,
            commentText,
            commentImage,
            isReply: true
        });

        if (comment) {
            parentComment.replies.push(comment);
            parentComment.save();

            res.status(201);
            res.json(comment);
        }else {
            res.status(400);
            throw new Error('Something went wrong.');
        }
    }else {
        res.status(404);
        throw new Error('Comment not found.');
    }
})

const updateComment = ansyncHandler(async (req, res) => {
    const {
        commentId,
        commentText,
        commentedBy
    } = req.body;

    const parentComment = await Comment.findById(commentId)

    if (parentComment) {
        const commentImage = [];
        
        if (req.files.length > 0) {
            req.files.forEach(file => {
                commentImage.push(imageFormarter(file, req))
            })
        }

        parentComment.commentedBy = commentedBy
        parentComment.commentText = commentText;
        parentComment.commentImage = commentImage;

        parentComment.save();
        res.status(200);
        res.json(parentComment);
    } else {
        res.status(404);
        throw new Error('Comment not found.');
    }
})

module.exports = {
    addComment,
    addReplyComment,
    updateComment
}