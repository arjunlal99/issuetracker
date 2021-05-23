/*
    Middleware function to check if the given status is a valid value
*/
module.exports = (req,res,next) => {
    if(req.body.status){
        if (req.body.status =='new' || req.body.status =='unresolved' || req.body.status =='resolved' || req.body.status =='open' || req.body.status =='closed'){
            next()
        }
        else{
            res.status(500).send({msg: "Invalid status value"})
        }
    }
    else next()
}