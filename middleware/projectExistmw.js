const projectController = require('../controllers/projectController.js')
/*
    Middleware function to check if project already exists ,used before creating new project
*/
module.exports = async (req,res,next) => {
    var projectExists = await projectController.projectCheck(req.body.project_id)
    if (projectExists){
        res.status(500).send({msg: "Project already exists"})
    }
    else{
        next()
    }
}