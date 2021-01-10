const Comment = require('../model/commentModel');
const Post = require('../model/postModel');
const ansyncHandler = require('express-async-handler');

const { upload } = require('../helpers/cloudinaryHelpers');
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
            req.files.forEach(async file => {
                const newFile = imageFormarter(file, req);
                const image = await upload(newFile.url);
    
                newFile['url'] = image;
                commentImage.push(newFile);
            })

            const checkImageArray = setInterval(async () => {
                if (commentImage.length == req.files.length) {
                    clearInterval(checkImageArray);
    
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
                }
            }, 100)
        } else {
            const comment = await Comment.create({
                postId,
                commentedBy,
                commentText
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
            req.files.forEach(async file => {
                const newFile = imageFormarter(file, req);
                const image = await upload(newFile.url);
    
                newFile['url'] = image;
                commentImage.push(newFile);
            })

            const checkImageArray = setInterval(async () => {
                if (commentImage.length == req.files.length) {
                    clearInterval(checkImageArray);
    
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
                }
            }, 100)
        } else {
            const comment = await Comment.create({
                postId,
                commentParentId: commentId,
                commentedBy,
                commentText,
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
        }
    }else {
        res.status(404);
        throw new Error('Comment not found.');
    }
})

const updateComment = ansyncHandler(async (req, res) => {
    const {
        commentId,
        commentText
    } = req.body;

    const parentComment = await Comment.findById(commentId)

    if (parentComment) {
        const commentImage = [];
        
        if (req.files.length > 0) {
            req.files.forEach(async file => {
                const newFile = imageFormarter(file, req);
                const image = await upload(newFile.url);
    
                newFile['url'] = image;
                commentImage.push(newFile);
            });

            const checkImageArray = setInterval(async () => {
                if (commentImage.length == req.files.length) {
                    clearInterval(checkImageArray);

                    parentComment.commentText = commentText;
                    parentComment.commentImage = commentImage;

                    parentComment.save();
                    res.status(200);
                    res.json(parentComment);
                }
            }, 100)
        } else {
            parentComment.commentText = commentText;

            parentComment.save();
            res.status(200);
            res.json(parentComment);
        }
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