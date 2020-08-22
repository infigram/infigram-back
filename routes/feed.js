const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')
const imageUpload = require('../middleware/imageUpload')


const router = require('express').Router()

//Get all the posts
router.get('/posts', feedController.getPosts)

//Post
router.post('/post',
         isAuth,
        imageUpload.single('image'),
        feedController.createPost)


//Put
router.put('/posts', feedController.updatePostById)

//Patch
router.patch('/posts', feedController.updatePostById)

//Delete all posts
router.delete('/posts', feedController.deleteAllPosts)

module.exports = router