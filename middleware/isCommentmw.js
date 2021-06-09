const commentController = require('../controllers/commentController.js')
/*
    Middleware function to check if comment already exists for post request
*/
module.exports = async (req,res,next) => {
    var isComment = await commentController.doesExist(req.body.comment_id)

    if (isComment){
        next()
    }
    else{
        res.status(500).send({msg: "Comment does not exists"})
    }
}