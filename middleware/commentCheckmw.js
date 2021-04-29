const commentController = require('../controllers/commentController.js')
/*
    Middleware function to check if comment already exists 
*/
module.exports = async (req,res,next) => {
    var commentExists = await commentController.doesExist(req.params.comment_id)

    if (commentExists){
        next()
    }
    else{
        res.status(500).send({msg: "Comment does not exists"})
    }
}