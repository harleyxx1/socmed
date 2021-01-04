const Post = require('../model/postModel');
const asyncHandler = require('express-async-handler');

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({});
    res.json(posts)
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const posts = await Post.find({ postedBy: userId }); 
    
    res.json(posts)
});

const submitPost = asyncHandler(async (req, res) => {
    const { postedBy, postText } = req.body;
    const postImage = [];

    const hostURL = req.protocol + '://' + req.get('host') + '/'
    
    if (req.files.length > 0) {
        req.files.forEach(file => {
            postImage.push({
                "originalname": "IMG_20210103_192151.jpg",
                "encoding": "7bit",
                "mimetype": "image/jpeg",
                "filename": "2021-01-04T12-06-06.961ZIMG_20210103_192151.jpg",
                "size": 3833758,
                "url": `${hostURL}${file.filename}`
            })
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

module.exports = {
    getAllPosts,
    getUserPosts,
    submitPost
}