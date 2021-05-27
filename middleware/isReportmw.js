const reportController = require('../controllers/reportController.js')
/*
    Middleware function to check if report already exists.
*/
module.exports = async (req,res,next) => {
    var reportExists = await reportController.reportCheck(req.body.report_id)

    if (reportExists){
        next()
    }
    else{
        res.status(500).send({msg: "Report does not exists"})
    }
}