const express = require('express')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/posts', isAuth, feedController.getPosts)

router.post('/post', isAuth, feedController.createPost)

module.exports = router