require('dotenv').config({path:'../.env'})
const userController = require('../controllers/userController.js')
const projectController = require('../controllers/projectController.js')
const reportController = require('../controllers/reportController.js')
const commentController = require('../controllers/commentController.js')

const apiIndex = {
    "userController":{
        "signUp": userController.signUp,
        "usernameCheck": userController.usernameCheck,
        "emailCheck": userController.emailCheck,
        "passwordCheck": userController.passwordCheck,
        "onUsernameCheck": userController.onUsernameCheck,
        "onAuthFail": userController.onAuthFail,
        "onAuthSuccess": userController.onAuthSuccess,
        "onSignUp": userController.onSignup
    },
    "projectController":{
        "createProject":  projectController.createProject,
        "projectCheck": projectController.projectCheck,
        "getProjectbyId": projectController.getProjectbyId,
        "getAllprojects": projectController.getAllprojects,
        "getTriagers": projectController.getTriagers,
        "addTriager": projectController.addTriager,
        "isPlatform": projectController.isPlatform,
        "isComponent": projectController.isComponent
    },
    "reportController":{
        "createReport": reportController.createReport,
        "getReportbyId": reportController.getReportbyId,
        "getAllreports": reportController.getAllreports,
        "getReports": reportController.getReports,
        "triage": reportController.triage,
        "reportCheck": reportController.reportCheck,
        "addComment": reportController.addComment,
        "onNewReport": reportController.onNewReport,
        "onFirstComment": reportController.onFirstComment,
        "onTriage": reportController.onTriage
    },
    "commentController":{
        "createComment": commentController.createComment,
        "getCommentById": commentController.getCommentById,
        "addNextComment": commentController.addNextComment,
	    "addReplyComment": commentController.addReplyComment,
        "getNextCommentId": commentController.getNextCommentId,
        "getReplyCommentId": commentController.getReplyCommentId,
	    "addCommentEnd": commentController.addCommentEnd,
	    "doesExist": commentController.doesExist,
	    "onComment": commentController.onComment,
	    "onReply": commentController.onReply
    }
}


module.exports = apiIndex