//Require validator
const {validationResult} = require('express-validator')

//Require post
const Post = require('../models/post')
const User = require('../models/user')

/**
 * Get all posts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getPosts = async(req, res, next)=>{
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        if(!error.statusCode){
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
exports.createPost = async(req, res, next)=>{
    //use req.fileAddress (console.log it first)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        return next(error);
    }
    const { title, content } = req.body;
    const { path } = req.file || '';
    const post = new Post({
        title,
        content,
        imageUrl: path,
        creator: req.userId
    })
    try {
        const savedPost = await post.save();
        const user = await User.findById(req.userId)
        user.posts.push(post)
        await user.save()
        res.status(201).json({message: 'post saved', post: savedPost});
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        error.data = 'post not created';
        return next(error);
    }
}

module.exports.deleteAllPosts = async (req,  res, next) => {
    try {
        const posts = await Post.remove({});
        res.status(200).json(posts);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}