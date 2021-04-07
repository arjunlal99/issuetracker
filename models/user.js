var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
    username: String,
    email: String,
    password_hash: String
})

userSchema.methods.getDetails = function() {
    return {username: this.username, email: this.email, password_hash: this.password_hash}
}

module.exports = userSchema