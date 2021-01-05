const Comment = require('../model/commentModel');
const Post = require('../model/postModel');
const ansyncHandler = require('express-async-handler');

const addComment = ansyncHandler(async (req, res) => {
    const {
        postId,
        commentedBy,
        commentText
    } = req.body;

    const post = await Post.findById(postId);

    if (post) {
        const commentImage = [];

        const hostURL = req.protocol + '://' + req.get('host') + '/'
        
        if (req.files.length > 0) {
            req.files.forEach(file => {
                postImage.push({
                    "originalname": file.originalname,
                    "encoding": file.encoding,
                    "mimetype": file.mimetype,
                    "filename": file.filename,
                    "size": file.size,
                    "url": `${hostURL}${file.filename}`
                })
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
        const hostURL = req.protocol + '://' + req.get('host') + '/'
        
        if (req.files.length > 0) {
            req.files.forEach(file => {
                commentImage.push({
                    "originalname": "IMG_20210103_192151.jpg",
                    "encoding": "7bit",
                    "mimetype": "image/jpeg",
                    "filename": "2021-01-04T12-06-06.961ZIMG_20210103_192151.jpg",
                    "size": 3833758,
                    "url": `${hostURL}${file.filename}`
                })
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

module.exports = {
    addComment,
    addReplyComment
}