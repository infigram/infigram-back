exports.getPosts = (req, res, next)=>{
    res.json({post1:'xyz', post2:'sdafs'}) //dummy data
}

exports.createPost = (req, res, next)=>{
    console.log('working')
}