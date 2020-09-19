//Require post
const Post = require('../models/post')
const User = require('../models/user')
const cloudinary = require('cloudinary').v2;

/**
 * Get all posts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.findAll = async (req, res, next) => {
    //Pagination number
    const postsPerPage = 5
    let page = Math.floor(Number(req.query.page)) || 1
    if (page < 1) {
        page = 1
    }
    try {
        const posts = await Post
            .find()
            .sort({ 'createdAt': -1 })
            .skip((page - 1) * postsPerPage)
            .limit(postsPerPage)
        if (posts.length === 0) {
            return res.status(404).json({ error: 'There are no posts' });
        }
        const jsonResponse = { posts, page }
        return res.status(200).json(jsonResponse);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}

/**
 * Get post by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.findById = async (req, res, next) => {
    try {
        const post = await Post
            .findOne({ _id: req.body._id });
        if (post === null || post === undefined) {
            return res.status(404).json({ error: "No post with this id" });
        }
        return res.status(200).json(post);
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
exports.create = async (req, res, next) => {
    const errors = req.validationErrors
    if (errors.length !== 0) {
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
        creator: req.userId,
    })
    try {
        const savedPost = await post.save();
        const user = await User.findById(req.userId)
        user.posts.push(post)
        await user.save()
        return res.status(201).json({ message: 'post saved', post: savedPost });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'post not created';
        return next(error);
    }
}

/**
 * Update post by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.updateById = (req, res, next) => {
    const errors = req.validationErrors;
    if (errors.length !== 0) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors
        return next(error);

    }
    const { _id, title, content } = req.body;
    const { path } = req.file;
    Post.findOne({ _id }).exec().then((err, post) => {
        if (err) res.status(500).json({ error: "Error" });
        if (post.public_id_cloudinary != path.fileAddress) {
            //Delete image in cloudinary if the public_id has changed
            //Get the post public id
            const n1 = post.imageUrl.indexOf("posts");
            const n2 = post.imageUrl.indexOf(".", n1);
            cloudinary.uploader.destroy(
                //Post public id
                post.imageUrl.slice(n1, n2)
                //uploadResult.public_id
            ).then((error, result) => {
                post.title = title;
                post.content = content;
                if (path === undefined || path === null || path === '') {
                    post.save((err) => {
                        if (err) res.status(500).json({ error: "Error" });
                    })
                }
                else {
                    post.imageUrl = path;
                    post.save((err) => {
                        if (err) res.status(500).json({ error: "Error" });
                    })
                }
            });
        }
        post.title = title;
        post.content = content;
        if (path === undefined || path === null || path === '') {
            post.save((err) => {
                if (err) res.status(500).json({ error: "Error" });
            })
        }
        else {
            post.imageUrl = path;
            post.save((err) => {
                if (err) res.status(500).json({ error: "Error" });
            })
        }
    })
}


/**
 * Delete post by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.deleteById = async (req, res, next) => {
    try {
        //Get the id from params
        const _id = req.params.id;
        const post = await Post.findOne({ _id })
        if (post === null || post === undefined) return res.status(404).json({ error: 'No post with this id' })
        //Get the post public id
        const n1 = post.imageUrl.indexOf("posts");
        const n2 = post.imageUrl.indexOf(".", n1);
        //Delete image in cloudinary
        await cloudinary.uploader.destroy(
            //post public id
            post.imageUrl.slice(n1, n2)
            //uploadResult.public_id
        ).then((error, result) => {
            //Delete the post after delete the image
            Post.deleteOne({ _id }).then(() => {
                res.status(204).json({ message: "Post deleted" });
            });
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}

/**
 * Delete all posts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.deleteAll = async (req, res, next) => {
    try {
        const posts = await Post.find({});

        posts.forEach(async post => {
            //Get the post public id
            const n1 = post.imageUrl.indexOf("posts");
            const n2 = post.imageUrl.indexOf(".", n1);
            await cloudinary.uploader.destroy(
                //post public id
                post.imageUrl.slice(n1, n2)
                //uploadResult.public_id
            ).then((error, result) => {
                //Delete the post after delete the image
                Post.deleteMany({}).then(() => {
                    return res.status(204).json({ message: "All Posts deleted" });
                });
            });
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}