var generateHash = require('../auth/auth.js').generateHash
var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})
var userSchema = require('../models/user.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true})
conn.once('open', () => {
    console.log('User Connection Established')
    
    //signUp('kopiko', 'kopiko@cappuccino.com', '123456')
    
    userCheck('example', 'example@email.com').then((docs) => console.log("user exists")).catch((err) => console.log(err))
})

var userModel = conn.model('users', userSchema)

//function for creating new User
function signUp(username, email, password){
    return new Promise((resolve, reject) => {
        var userInstance = new userModel({
            username: username,
            email: email,
            password_hash: generateHash(password)
        })

        userInstance.save((err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })
    })
}

//function for checking if username or email already exists
function userCheck(username, email){
    return new Promise((resolve,reject) => {
        userModel.exists({username: username}, (err, docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })
    })
}




module.exports = {
    signUp
}