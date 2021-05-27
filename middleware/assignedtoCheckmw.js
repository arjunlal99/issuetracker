const userController = require('../controllers/userController.js')
/*
    Middleware function to check if assigned_to is valid or not
*/
module.exports = async (req,res,next) => {
    if(req.body.assigned_to){
        var isUser = await userController.usernameCheck(req.body.assigned_to)
        if (isUser){
            next()
        }
        else{
            res.status(500).send({msg: "Assigned_to is not a valid user"})
        }

    }
    else{
        req.body.assigned_to = null
        next()
    } 
   
}