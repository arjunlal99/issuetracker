const userController = require('../controllers/userController.js')
/*
    Middleware function to check if username exists (used before generating auth token)
*/

module.exports = async (req,res,next) => {
    var usernameExists = await userController.usernameCheck(req.body.username)
    if (usernameExists){
        next()
    }
    else{
        res.status(500).send({msg: 'Invalid Username'})
    }
}