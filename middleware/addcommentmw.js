const reportController = require('../controllers/reportController.js')
const commentController = require('../controllers/commentController.js')
/*
    Middleware function to attach comment to correct report
*/
module.exports = async (req,res,next) => {
    var response = await commentController.createComment( req.body.user, req.body.comment )
    var report = await reportController.getReportbyId(req.params.report_id)
    if(report.first_comment = null){
        var rep = await reportController.addComment(report._id, response._id)
    }
    else{
        var comment = await commentController.getCommentById(report.first_comment)
        while(commentController.getNextCommentId(comment._id)){
            comment = await commentController.getCommentById(commentController.getNextCommentId(comment._id))
        }
        var res = await commentController.addNextComment(comment._id,response._id )
    }
    next()
    
}