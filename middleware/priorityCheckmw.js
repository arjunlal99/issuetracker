/*
    Middleware function to check if the given priority is a valid value
*/
module.exports = (req,res,next) => {
    if(req.body.priority){
        if (req.body.priority>=1 && req.body.priority<=5){
            next()
        }
        else{
            res.status(500).send({msg: "Invalid priority value"})
        }
    }
    else{
        req.body.priority
        next()
    }
    
}