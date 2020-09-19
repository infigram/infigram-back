const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Post schema
const postSchema = new mongoose.Schema({
    //Title
    title: {
        type: String,
        required: true
    },
    //Content
    content: {
        type: String,
        required: true
    },
    //Image url store in cloudinary
    imageUrl: {
        type: String,
    },
    // Create of the post ( user )
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
}, { timestamps: true });

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', postSchema);

//To do - add imageUrl , connect with user model