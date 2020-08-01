const {body} = require('express-validator')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')
const imageUpload = require('../middleware/imageUpload')
const uuid = require('uuid')

const router = require('express').Router()

//Get all the posts
router.get('/posts', feedController.getPosts)

//Post
router.post('/post',
         isAuth,
        ((req, res, next)=>{req.fileAddress= `${req.userId}/${uuid.v1()}`; next()}),
        imageUpload.single('image'),
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