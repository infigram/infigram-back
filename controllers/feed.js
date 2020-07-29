const Post = require('../models/post')

exports.getPosts = async(req, res, next)=>{
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        error.message = 'unable to fetch posts'
        next(error)
    }
}

exports.createPost = async(req, res, next)=>{
    const title = req.body.title
    const content = req.body.content
    const username = req.user.username
    const post = new Post({
        title,
        content,
        username
    })
    try {
        const savedPost = await post.save()
        res.status(201).json({message: 'post saved', post: savedPost})
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        error.message = 'post not created'
        next(error)
    }
}