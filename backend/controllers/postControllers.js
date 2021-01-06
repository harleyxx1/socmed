const Post = require('../model/postModel');
const asyncHandler = require('express-async-handler');

const { imageFormarter } = require('../utils/formatters');

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate([
        {
            path: 'postedBy',
            select: '-password'
        },
        {
            path: 'comment',
            populate: [{
                path: 'replies',
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
    res.json(posts)
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { postedBy } = req.body;
    const posts = await Post.find({ postedBy }).populate([
        {
            path: 'postedBy',
            select: '-password'
        },
        {
            path: 'comment',
            populate: [{
                path: 'replies',
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

    res.json(posts)
});

const submitPost = asyncHandler(async (req, res) => {
    const { postedBy, postText } = req.body;
    const postImage = [];
    
    if (req.files.length > 0) {
        req.files.forEach(file => {
            postImage.push(imageFormarter(file, req))
        })
    } 

    const post = await Post.create({
        postedBy,
        postText,
        postImage
    })

    if (post) {
        res.status(201);
        res.json(post)
    } else {
        res.status(400);
        throw new Error('Error. Please try again.')
    }
})

const updatePost = asyncHandler(async (req, res) => {
    const {
        postId,
        postText,
    } = req.body;

    const post = await Post.findById(postId);

    if (post) {
        const postImage = [];
    
        if (req.files.length > 0) {
            req.files.forEach(file => {
                postImage.push(imageFormarter(file, req))
            })
        }
        
        if (postText) post.postText = postText;
        post.postImage = postImage;

        post.save();
        res.status(200);
        res.json(post);
    } else {
        res.status(400)
        res.json('Bad request')
    }

    // res.json(post);
}) 

module.exports = {
    getAllPosts,
    getUserPosts,
    submitPost,
    updatePost
}