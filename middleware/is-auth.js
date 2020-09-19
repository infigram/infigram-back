const User = require('../models/user');
const passport = require('passport');

module.exports.ensuredAuthenticated = (req, res, next) => {
    if(passport.authenticate('jwt', { session : false })){
        next()
    }
    else{
        return res.status(403).json({
            err: "Not authenticated"
        })
    }
}