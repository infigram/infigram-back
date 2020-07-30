const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Encrypt the password
 * @param {String} password the password to be encrypted
 */
module.exports.encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

/**
 * Compare password pass in and encrypted password
 * @param {String} data the password pass in
 * @param {String} encrypted the password that was encrypted
 */
module.exports.comparePassword = (data, encrypted) => {
    return bcrypt.compareSync(data, encrypted)
}