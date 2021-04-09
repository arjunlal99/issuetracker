const userController = require('../controllers/userController.js')
/*
    Middleware to check if password is correct
*/

module.exports = async (req, res, next) => {
    var isPassword = await userController.passwordCheck(req.body.username, req.body.password)
    if (isPassword) {
       // console.log(isPassword)
        next()
    }
    else{
        res.status(500).send({msg: "Invalid password"})
    } 
}