const projectController = require('../controllers/projectController.js')
/*
    Middleware function to check if the project is there or not
*/
module.exports = async (req,res,next) => {
    var projectExists = await projectController.projectCheck(req.params.project_id)
    // console.log(projectExists)
    if (projectExists){
        next()
    }
    else{
        res.status(500).send({msg: "Project does not exists"})
    }
}