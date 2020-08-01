const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const { encryptPassword } = require('../helpers/bcrypt');

//User schema
const UserSchema = new mongoose.Schema(
    {
        //User's email unique
        email: {
            type: String,
            required: true,
            index: true,
            //Unique email
            unique: true
        },
        //User's password
        password: {
            type: String,
            required: true
        },
        //User's username
        username: {
            type: String,
            required: false
        },
        //User's image url - profile etc
        imageUrl: {
            type: String
        },
        //User's name
        name: {
            type: String
        },
        //User status
        status: {
            type: String,
        },
        //User posts
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    }
);

//Unique plugin
UserSchema.plugin(mongooseUniqueValidator);

/**
 * Encrypt password 
 */
UserSchema.pre('save', function(next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (user.isModified('password')){
        user.password = encryptPassword(user.password);
    }
    next();
})

module.exports = mongoose.model('User', UserSchema);