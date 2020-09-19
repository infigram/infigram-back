const User = require('../models/user')

class UserController{
    //Get all user posts
    static getUserPosts(req, res, next){
        const { _id } = req.user;
        User.
        findOne({ _id: _id }).
        populate('posts').
        exec(function (err, user) {
          if (err) return handleError(err);
          res.json(user.posts)
          // prints "The author is Ian Fleming"
        });
    }
}

module.exports = UserController;