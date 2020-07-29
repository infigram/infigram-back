const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model('Post', postSchema);

//To do - add imageUrl , connect with user model