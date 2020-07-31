const User = require('../models/user');

module.exports = async(req, res, next)=>{
    //dummy user email = test@test.com
    try {
        let dummyUser = await User.findOne({email:'test@test.com'})
        if(!dummyUser){
            dummyUser = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'IamDumb',
                status: 'hello there!',
            })
            dummyUser = await dummyUser.save()
        }
        req.userId = dummyUser._id;
        next();
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        error.data = 'unable to fetch posts';
        return next(error);
    }
}