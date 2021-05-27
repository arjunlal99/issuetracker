/*
    Middleware function to check if the label is given or not
*/
module.exports = (req,res,next) => {
    if(req.body.label){
        next()
    }
    else {
        req.body.label = null
        next()
    }
        
}