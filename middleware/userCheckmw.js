const userController = require('../controllers/userController.js')
/*
    Middleware function to check if username or email already exists (used before signing up new user)
*/
module.exports = async (req,res,next) => {
    var usernameExists = await userController.usernameCheck(req.body.username)
    var emailExists = await userController.emailCheck(req.body.email)
    console.log(usernameExists, emailExists)
    if (usernameExists && emailExists){
        res.status(500).send({msg: "Username and Email already exists"})
    }
    else if (usernameExists){
        res.status(500).send({msg: "Username already exists"})
    }
    else if (emailExists){
        res.status(500).send({msg: "Email already exists"})
    }
    else{
        next()
    }
}