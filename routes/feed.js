const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const imageUpload = require('../middleware/imageUpload');


const router = require('express').Router();

//Get all the posts
router.get('/posts', feedController.findAll);


//Get all the posts
router.get('/posts/:id', feedController.findById);

//Post
router.post('/posts',
        isAuth,
        imageUpload.single('image'),
        feedController.create);


//Put
router.put('/posts', feedController.updateById);

//Patch
router.patch('/posts', feedController.updateById);

router.delete('/posts/:id', feedController.deleteById);

//Delete all posts
router.delete('/posts', feedController.deleteAll);

module.exports = router