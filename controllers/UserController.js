const {validationResult} = require('express-validator')

const User = require('../models/user')

class UserController{
    //Get all user posts
    static getUserPosts(req, res, next){
        const { _id } = req.body;
        User.
        findOne({ _id: _id }).
        populate('posts').
        exec(function (err, user) {
          if (err) return handleError(err);
          console.log(user.posts.title);
          // prints "The author is Ian Fleming"
        });
    }
}

module.exports = UserController;