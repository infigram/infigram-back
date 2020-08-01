const {body} = require('express-validator')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')
const imageUpload = require('../middleware/imageUpload')

const router = require('express').Router()

//Get all the posts
router.get('/posts', feedController.getPosts)

//Post
router.post('/post', isAuth, imageUpload,
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