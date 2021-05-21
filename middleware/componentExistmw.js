const projectController = require('../controllers/projectController.js')
/*
    Middleware function to check if the component is present in the project
*/
module.exports = async (req,res,next) => {
    if(req.body.components){
        var isComponent = await projectController.isComponent(req.body.project_id,req.body.components)
        //console.log(isComponent)
        if (isComponent){
            next()
        }
        else{
            res.status(500).send({msg: "Component is not valid"})
        }

    }
    else next()
   
}