module.exports = (req, res, next)=>{
    const dummyUser = {
        username: 'dummy'
    };
    req.user = dummyUser;
    next();
}