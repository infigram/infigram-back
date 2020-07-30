const {body} = require('express-validator')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

const router = require('express').Router()

//Get all the posts
router.get('/posts', isAuth, feedController.getPosts)

//Post
router.post('/post', isAuth,
    [
        body('title')
            .trim()
            .isLength({min:5}),
        body('content')
            .trim()
            .isLength({min:5}),
    ],
    feedController.createPost)

module.exports = router