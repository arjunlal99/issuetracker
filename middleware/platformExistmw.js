const projectController = require('../controllers/projectController.js')
/*
    Middleware function to check if the platform is present in the project
*/
module.exports = async (req,res,next) => {
    if(req.body.platforms){
        var isPlatform = await projectController.isPlatform(req.body.project_id,req.body.platforms)
        //console.log(isPlatform)
        if (isPlatform){
            next()
        }
        else{
            res.status(500).send({msg: "Platform is not valid"})
        }

    }
    else next()
   
}