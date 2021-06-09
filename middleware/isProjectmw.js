const projectController = require('../controllers/projectController.js')
/*
    Middleware function to check if the project is there or not for post request 
*/
module.exports = async (req,res,next) => {
    //req.body.project_id = Number(req.body.project_id)
    console.log(req.body.project_id)
    var isProject = await projectController.projectCheck(req.body.project_id)
    console.log(isProject)
    if (isProject){
        next()
    }
    else{
        res.status(500).send({msg: "Project does not exists"})
    }
}