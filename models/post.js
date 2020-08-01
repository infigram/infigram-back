const mongoose = require('mongoose');

//Post schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

//To do - add imageUrl , connect with user model