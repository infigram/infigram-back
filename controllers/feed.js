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
    const postsPerPage = 5
    let page = Math.floor(Number(req.query.page)) || 1
    if (page<1){
        page=1
    }
    try {
        const posts = await Post
                            .find()
                            .sort({'createdAt':-1})
                            .skip((page-1)*postsPerPage)
                            .limit(postsPerPage)
        const jsonResponse = {posts, page}
        res.status(200).json(jsonResponse);
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
    const errors = req.validationErrors
    if(errors.length !== 0){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors
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

module.exports.updatePostById = async (req,  res, next) => {
    const errors = req.validationErrors
    if(errors.length !== 0){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors
        return next(error);
    }
    const { _id, title, content } = req.body;
    const { path } = req.file;
    await Post.findOne({_id: _id}, (err, post) =>{
        if(err) res.status(402).json({message : "Error"});
        post.title = title;
        post.content = content;
        if(path === undefined || path === null || path === ''){
            post.save((err) => {
                if(err) res.status(402).json({message : "Error"});
            })
        }
        else{
            post.imageUrl = path;
            post.save((err) => {
                if(err) res.status(402).json({message : "Error"});
            })
        }
    })
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