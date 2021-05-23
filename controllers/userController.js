var generateHash = require('../auth/auth.js').generateHash //function to generate hash using sha-256 algorithm
var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})

//Event Emitters
var pluginManager = require("../plugin/pluginManager.js")

const EventEmitter = require('events')
/*
    onUsernameCheck event
    callback parameters => username(username checked), docs[true or false]
*/
class UserName extends EventEmitter{
    addListener(callback){
        this.on('onUsernameCheck', callback)
    }
}

const onUsernameCheck = new UserName()

onUsernameCheck.addListener((username,docs) => {
    //console.log(username,docs)
    pluginManager.emitEvents("userController", "onUsernameCheck", [username,docs])
})
/*
    onAuthFail event
    callback parameters => username(username for which auth failed)
*/
class AuthFail extends EventEmitter{
    addListener(callback){
        this.on('onAuthFail', callback)
    }
}

const onAuthFail = new AuthFail()

onAuthFail.addListener((username) => {
    pluginManager.emitEvents("userController", "onAuthFail", [username])
})
/*
    onAuthSuccess event
*/
class AuthSuccess extends EventEmitter{
    addListener(callback){
        this.on("onAuthSuccess", callback)
    }
}

const onAuthSuccess = new AuthSuccess()

onAuthSuccess.addListener((username) => {
    pluginManager.emitEvents("userController", "onAuthSuccess", [username])
})

var userSchema = require('../models/user.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true})
conn.once('open', async () => {
    console.log('User Connection Established')
   // pluginManager.emitEvents()
    //signUp('kopiko', 'kopiko@cappuccino.com', '123456')
    
    //usernameCheck('example').then((docs) => console.log(docs)).catch((err) => console.log(err))
    //usernameCheck('somwthing').then((docs) => console.log(docs)).catch((err) => console.log(err))
    //console.log(await usernameCheck('example'))
    //console.log(await passwordCheck('example', 'somwthin'))
})

var userModel = conn.model('users', userSchema)
/*
    Function for creating new User
*/
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

/*Function for checking if username already exists
    --> returns true if username already exists, false if it doesn't
    
*/
function usernameCheck(username){
    return new Promise((resolve,reject) => {
        userModel.exists({username: username}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                onUsernameCheck.emit('onUsernameCheck', username, docs)
                resolve(docs)
            }
        })
    })
}

/*
    Function for checking if email already exists
    --> returns true if email already exists, false if it doesn't
    
*/
function emailCheck(email){
    return new Promise((resolve,reject) => {
        userModel.exists({email: email}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })
    })
}

/*
    Function to verify if password is correct for a user. (Assumes user already exists)
        --> resolves true if password is correct, false if it isn't
*/
function passwordCheck(username, password){
    return new Promise((resolve,reject) => {
        userModel.findOne({username: username}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                if (docs.password_hash == generateHash(password)){
                    onAuthSuccess.emit('onAuthSuccess', username)
                    resolve(true)
                } 
                else{
                    onAuthFail.emit('onAuthFail', username)
                    resolve(false)
                }
            }
        })
    })
}

function healthCheck(){
    return conn.readyState
}

module.exports = {
    
    signUp,
    usernameCheck,
    emailCheck,
    passwordCheck,
    onUsernameCheck,
    onAuthFail,
    onAuthSuccess,
    healthCheck
}