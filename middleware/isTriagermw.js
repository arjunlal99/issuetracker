const projectController = require('../controllers/projectController.js')
const reportController = require('../controllers/reportController.js')
const {verifyJwt} = require('../auth/jwt.js')

/*
    Middleware to check if a user is a triager for a given project(Assuming user already exists and authorization header is valid)
     (Meant to be used to authorize triage function)
*/
module.exports = async (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1]
    const user = await verifyJwt(token)
    let username = user.user
    var report = await reportController.getReportbyId(req.body.report_id)
    var isTriager = await projectController.isTriager(report.project_id, username)
    if (isTriager){
        next()
    }
    else{
        res.status(500).send({msg: "User not authorized to triage"})
    }
    /*
    isTriager(req.body.project_id, username).then((docs) => {
        console.log("Line3")
        if (docs == true){
            next()
        }else{
            res.status(500).send({msg:"User not authorized to triage"})
        }
    }).catch(err => {
        res.status(500).send({msg:"Internal Error"})
    })
    console.log("line4")
    res.send(user)
    */
}