const Post = require('../model/postModel');
const asyncHandler = require('express-async-handler');

const { upload } = require('../helpers/cloudinaryHelpers');
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
            if (postImage.length == req.files.length) {
                clearInterval(checkImageArray);

                if (postText) post.postText = postText;

                post.save();
                res.status(200);
                res.json(post);
            }
        }
        
        
    } else {
        res.status(400)
        res.json('Bad request')
    }
})

module.exports = {
    getAllPosts,
    getUserPosts,
    submitPost,
    updatePost
}