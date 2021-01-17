const Post = require('../model/postModel');
const Comment = require('../model/commentModel');
const asyncHandler = require('express-async-handler');

const { upload } = require('../helpers/cloudinaryHelpers');
const { imageFormarter } = require('../utils/formatters');

/**
 * Page limit of the post return.
 */
const pageLimit = 10;


/**
 * Endpoint for deleting the user post.
 * 
 * @returns {{
 *      message: String
 * }}
 */
const deletePost = asyncHandler(async (req, res) => {
    const {
        postId
    } = req.body;

    const post = await Post.findById(postId);

    if (post) {
        post.deleted = true;
        post.save();

        if (post.comment.length > 0) {
            post.comment.forEach(async commentId => {
            
                const comment = await Comment.findOneAndUpdate(
                    { "_id": commentId },
                    { "deleted": true },
                    { new: true }
                )

                if (comment.replies.length > 0) {
                    comment.replies.forEach(replyId => {
                        Comment.findOneAndUpdate(
                            { "_id": replyId }, 
                            { "deleted": true }
                        )

                        res.status(200);
                        res.json({
                            message: 'Post is successfully deleted.'
                        })
                    })
                } else {
                    res.status(200);
                    res.json({
                        message: 'Post is successfully deleted.'
                    })
                }
            })
        } else {
            res.status(200);
            res.json({
                message: 'Post is successfully deleted.'
            })
        }
    }
    else {
        res.status(400);
        throw new Error('Post not found.')
    }
});

/**
 * Endpoint for getting all posts.
 * 
 * @returns [{
 *      Posts: Array of posts.
 * }]
 */
const getAllPosts = asyncHandler(async (req, res) => {
    const { page } = req.body;
    const result = {};

    if (page < 0 || typeof page !== 'number') {
        res.status(400);
        throw new Error('Bad request.')
    }
    
    const postCount = await Post.find({ "deleted": false }).countDocuments();

    const posts = await Post.find({ "deleted": false }).limit(pageLimit).skip(page * pageLimit).populate([
        {
            path: 'postedBy',
            select: '-password'
        },
        {
            path: 'comment',
            match: { deleted: false },
            populate: [{
                path: 'replies',
                select: '-replies',
                match: { deleted: false },
                populate: {
                    path: 'commentedBy',
                    select: '-password'
                }
            }, {
                path: 'commentedBy',
                select: '-password'
            }]
        }
    ])

    result.post_count = postCount;
    result.post_per_page = 10;
    result.post_page = page + 1;
    result.result_count = posts.length;
    result.total_page = (postCount / 10) % 1 !== 0 ? Math.floor(postCount/10) + 1 : postCount;
    result.data = posts;

    res.status(200);
    res.json(result)
});

/**
 * Endpoint for getting user posts.
 * 
 * @returns [{
 *      Posts: Array of posts.
 * }]
 */
const getUserPosts = asyncHandler(async (req, res) => {
    const {
        page,
        postedBy
    } = req.body;

    const result = {};

    if (page < 0 || typeof page !== 'number') {
        res.status(400);
        throw new Error('Bad request.')
    }

    const postCount = await Post.find({ postedBy, "deleted": false }).countDocuments();

    const posts = await Post.find({ postedBy, "deleted": false }).limit(pageLimit).skip(page * pageLimit).populate([
        {
            path: 'postedBy',
            select: '-password'
        },
        {
            path: 'comment',
            match: { deleted: false },
            populate: [{
                path: 'replies',
                match: { deleted: false },
                select: '-replies',
                populate: {
                    path: 'commentedBy',
                    select: '-password'
                }
            }, {
                path: 'commentedBy',
                select: '-password'
            }]
        }
    ])

    result.post_count = postCount;
    result.post_per_page = 10;
    result.post_page = page + 1;
    result.result_count = posts.length;
    result.total_page = (postCount / 10) % 1 !== 0 ? Math.floor(postCount/10) + 1 : postCount;
    result.data = posts;

    res.status(201)
    res.json(result)
});

/**
 * Endpoint for getting submiting post.
 * 
 * @returns {{
 *      post
 * }}
 */
const submitPost = asyncHandler(async (req, res) => {
    const { postedBy, postText } = req.body;
    var postImage = [];

    if (req.files.length > 0) {
        req.files.forEach(async file => {
            const newFile = imageFormarter(file, req);
            const image = await upload(newFile.url);

            newFile['url'] = image;
            postImage.push(newFile);
        })

        const checkImageArray = setInterval(async () => {
            if (postImage.length == req.files.length) {
                clearInterval(checkImageArray);

                const post = await Post.create({
                    postedBy,
                    postText,
                    postImage
                })

                if (post) {
                    res.status(201);
                    res.json(post);
                } else {
                    res.status(400);
                    throw new Error('Bad request.')
                }
            }
        }, 100)
    } else { 
        const post = await Post.create({
            postedBy,
            postText
        })

        if (post) {
            res.status(201);
            res.json(post);
        } else {
            res.status(400);
            throw new Error('Bad request.')
        }
    }
})

/**
 * Endpoint for getting updating post.
 * 
 * @returns {{
 *      post
 * }}
 */
const updatePost = asyncHandler(async (req, res) => {
    const {
        postId,
        postText,
    } = req.body;

    const post = await Post.findById(postId);

    if (post) {
        const postImage = [];
    
        if (req.files.length > 0) {
            req.files.forEach(async file => {
                const newFile = imageFormarter(file, req);
                const image = await upload(newFile.url);
    
                newFile['url'] = image;
                postImage.push(newFile);
            })

            const checkImageArray = setInterval(async () => {
                if (postImage.length == req.files.length) {
                    clearInterval(checkImageArray);
    
                    if (postText) post.postText = postText;
                    post.postImage = postImage;

                    post.save();
                    res.status(200);
                    res.json(post);
                }
            }, 100)
        } else {
            if (postText) post.postText = postText;
            
            post.save();
            res.status(200);
            res.json(post);
        }
        
        
    } else {
        res.status(400)
        res.json('Bad request')
    }
})

module.exports = {
    deletePost,
    getAllPosts,
    getUserPosts,
    submitPost,
    updatePost
}