const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const { encryptPassword } = require('../helpers/bcrypt');

//User schema
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
            //Unique email
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: false
        },
        imageUrl: {
            type: String
        },
        name: {
            type: String
        },
        status: {
            type: String,
            enum: ['busy', 'active', 'offline']
        },
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
UserSchema.pre('save', (next) => {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    user.password = encryptPassword(user.password);

    next();
})

module.exports = mongoose.model('User', UserSchema);