const {isTriager} = require('../controllers/projectController')
const {verifyJwt} = require('../auth/jwt.js')

/*
    Middleware to check if a user is a triager for a given project(Assuming user already exists and authorization header is valid)
     (Meant to be used to authorize triage function)
*/
module.exports = async (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1]
    const user = await verifyJwt(token)
    let username = user.user
    isTriager(req.body.project_id, username).then((docs) => {
        if (docs == true){
            next()
        }else{
            res.status(500).send({msg:"User not authorized to triage"})
        }
    }).catch(err => {
        res.status(500).send({msg:"Internal Error"})
    })
    res.send(user)
}