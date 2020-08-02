//Require validator
const { validationResult } = require('express-validator')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//Require post
const Post = require('../models/post')
const User = require('../models/user')

/**
 * Get all posts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}

/**
 * Create post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createPost = async (req, res, next) => {
    //use req.fileAddress (console.log it first)
    const { path } = req.file || '';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        fs.unlinkSync(path);
        return next(error);
    }

    try {
        await cloudinary.uploader.upload(
            path,
            { public_id: `posts/${req.fileAddress}`, tags: `posts` }, // directory and tags are optional
            async (err, image) => {
                if (err) return res.send(err)
                console.log('file uploaded to Cloudinary')
                // remove file from server
                fs.unlinkSync(path)
                // return image details
                const { title, content } = req.body;
                const post = new Post({
                    title,
                    content,
                    imageUrl: image.url,
                    creator: req.userId
                })
                const savedPost = await post.save();
                const user = await User.findById(req.userId)
                user.posts.push(post)
                await user.save()

                res.status(201).json({ message: 'post saved', post: savedPost });
            }
        )

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'post not created';
        return next(error);
    }
}

module.exports.deleteAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.remove({});
        res.status(200).json(posts);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}