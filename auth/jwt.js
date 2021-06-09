/*
    Module containing basic jwt operations
*/
const jwt = require('jsonwebtoken')
require('dotenv').config({path: '../.env'})

function createJwt(payload){
    return jwt.sign({user: payload}, process.env.JWT_SECRET, {expiresIn: 3600})
}

function verifyJwt(token){
    //return jwt.verify(token, process.env.JWT_SECRET)
    return new Promise((resolve,reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if (err){
                return reject(err)
            }else{
                resolve(decoded)
            }
        })
    })
}


module.exports = {
    createJwt,
    verifyJwt
}