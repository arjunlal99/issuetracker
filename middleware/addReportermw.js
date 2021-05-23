const {verifyJwt} = require('../auth/jwt.js')
/*
    Middleware to add reporter to body from auth token  
*/
module.exports = async (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1]
    const user = await verifyJwt(token)
    let username = user.user
    req.body.reporter = username
    next()
}