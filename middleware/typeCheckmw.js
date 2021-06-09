/*
    Middleware function to check if the given type is a valid value
*/
module.exports = (req,res,next) => {
    if(req.body.type){
        if (req.body.type =='bug' || req.body.type =='feature' || req.body.type == 'improvement'){
            next()
        }
        else{
            res.status(500).send({msg: "Invalid type value"})
        }
    }
    else next()
    
}