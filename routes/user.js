const userController = require('../controllers/UserController');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user')

const router = require('express').Router();

//Get all the posts of user
router.get('/user/posts', userController.getUserPosts);

module.exports = router