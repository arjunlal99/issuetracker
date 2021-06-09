
var path = require('path')
global.rootDir = path.dirname(require.main.filename)//determines project root directory at startup from index.js

var rl = require('./cli.js')
var pluginManager = require('./plugin/pluginManager.js')


var express = require('express')
var app = express()


require('dotenv').config()


var cookieParser = require('cookie-parser')
var multer = require("multer")
var upload = multer({dest: 'temp/'})

var jwt = require('./auth/jwt.js')



//importing controllers
var userController = require('./controllers/userController.js')
var projectController = require('./controllers/projectController.js')
var reportController = require('./controllers/reportController.js')
var commentController = require('./controllers/commentController.js')

var similarity = require("./similarity/similarity.js")
similarity.tempReports(101)
//importing middleware
var userCheck = require('./middleware/userCheckmw.js')
var usernameCheck = require('./middleware/usernameCheckmw.js')
var passwordCheck = require('./middleware/passwordCheckmw')
var projectExist = require('./middleware/projectExistmw.js')
var projectCheck = require('./middleware/projectCheckmw.js')
var reportCheck = require('./middleware/reportCheckmw.js')
var commentCheck = require('./middleware/commentCheckmw.js')
var isTriager = require('./middleware/isTriagermw.js')
var isProject = require('./middleware/isProjectmw.js')
var priorityCheck = require('./middleware/priorityCheckmw.js')
var statusCheck = require('./middleware/statusCheckmw.js')
var typeCheck = require('./middleware/typeCheckmw.js')
var platformExist = require('./middleware/platformExistmw.js')
var componentExist = require('./middleware/componentExistmw.js')
var isComment = require('./middleware/isCommentmw.js')
var addReporter = require("./middleware/addReportermw.js")
var addTriager = require("./middleware/addTriagermw.js")
var componentExistmw = require('./middleware/componentExistmw.js')
var verifyToken = require('./middleware/verifytokenmw.js')
var labelExist = require('./middleware/labelExistmw.js')
var assignedtoCheck = require('./middleware/assignedtoCheckmw.js')
var addCommenter = require('./middleware/addCommentermw.js')
var fileupload = require('./middleware/fileuploadmw.js')
var isReport = require('./middleware/isReportmw.js')
const fileuploadmw = require('./middleware/fileuploadmw.js')

const { response } = require('express')


app.get('/helloworld',(req,res) => {
    res.send("Hello World Endpoint")
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

/*
    Endpoint for signing up new user
*/
app.post('/auth/signup', userCheck, async (req,res) => {

    var response = await userController.signUp(req.body.username, req.body.email, req.body.password)
    res.send({msg: `Signed up new user: Username -> ${response.username},  Email -> ${response.email}`})

})

/*
    Endpoint for generating auth token and setting as cookie
*/
app.post('/auth/gentoken', usernameCheck, passwordCheck, async (req,res) => {

    var token = jwt.createJwt(req.body.username)
    console.log(token)
    res.cookie('token', token)
    res.send({msg: 'Auth Token Cookie set successfully'})

})
/*
  Endpoint to create project
*/
app.post('/createProject',projectExist, async (req,res) => {
    var response = await projectController.createProject(req.body.project_id, req.body.project_name, req.body.components, req.body.repository, req.body.triagers, req.body.platforms)
    res.send({msg: `New Project created: Project id -> ${response.project_id}, Project name -> ${response.project_name}`})
})


/*
   Endpoint to get project by id
*/
app.get('/project/:project_id', projectCheck, async(req,res) => {
    var response = await projectController.getProjectbyId(req.params.project_id)
    res.send({msg: `Project found : Project id -> ${response.project_id}, Project name -> ${response.project_name}`})
})
/*
   Endpoint to view all projects
*/
app.get('/project/', async(req,res) => {
    var response = await projectController.getAllprojects()
    res.send({msg: `Projects : ${response}`})
})

/*
   Endpoint to see all reports 
*/
app.get('/report/',async(req,res) => {
    var response = await reportController.getAllreports()
    res.send({msg: `Reports : ${response}`})
})
/*
   Endpoint to retrieve reports of a project
*/
app.get('/report/:project_id',projectCheck, async(req,res) => {
    var response = await reportController.getReports(req.params.project_id)
    res.send({msg : `Reports : ${response}` })
})

/*
    Endpoint to create report
*/
app.post('/report/add',upload.array('attach', 12), verifyToken,isProject,platformExist,typeCheck, priorityCheck, addReporter, componentExist, labelExist,  fileupload,  async(req, res) => {
    //fix label,attachments middleware
    var response = await reportController.createReport(req.body.project_id, req.body.platforms, req.body.type, req.body.priority,  req.body.reporter, req.body.component, req.body.title, req.body.description, req.body.version,labels = req.body.labels, attachments = req.body.attachments)
    res.send({msg: `New Report created: Report id -> ${response._id}, Report Title -> ${response.title}, Project id -> ${response.project_id}`})
})
/*
   Endpoint to triage a report
*/
app.post('/report/triage',verifyToken, isReport, isTriager, addTriager, statusCheck, priorityCheck, labelExist, assignedtoCheck, async(req,res) => {

    
    var respose = await reportController.triage(req.body.report_id, req.body.triager, status = req.body.status, priority=req.body.priority, labels=req.body.labels, assigned_to=req.body.assigned_to)
    res.send({msg : `Report -> ${response}`})
})
/*
   Endpoint to retrieve comment from comment_id
*/
app.get('/comment/:comment_id',commentCheck, async(req,res) =>{
    var response = await commentController.getCommentById(req.params.comment_id)
    res.send({msg: `Comment found  ${response}`})
})
/*
   Endpoint to get reply of a comment
*/
app.get('/comment/:comment_id/reply',commentCheck, async(req,res) => {
    var response = await commentController.getReplyCommentId(req.params.comment_id)
    if(response){
        var comment = await commentController.getCommentById(response)
        res.send({msg :  `Reply ${comment} `})
    }
    else{
        res.send({msg : `Reply not found ` })
    }
})
/*
    Endpoint to add comment(Authenticated endpoint)
*/
app.post('/comment/:report_id',upload.array('attach',10), verifyToken, reportCheck, addCommenter, fileupload, async (req, res) => {
    
    var comment = await commentController.createComment(req.body.user, req.body.comment, attachments = req.body.attachments)
   
    var report = await reportController.getReportbyId(req.params.report_id)
    
    if (report.first_comment == null){
        await reportController.addComment(report._id, comment._id)
        res.send({msg: `Comment added to report : ${comment}`})
    }
    else{
        await commentController.addCommentEnd(report.first_comment, comment._id)
        res.send({msg: `Comment added to report : ${comment}`})
    }
    
})
/*
    Endpoint to reply a comment
*/
app.post('/comment/:comment_id/reply',upload.array('attach',10), verifyToken, commentCheck, addCommenter,fileupload, async(req,res) => {
    
    var comment = await commentController.createComment(req.body.user, req.body.comment, attachments = req.body.attachments)
    var headcomment = await commentController.getCommentById(req.params.comment_id)
    if(headcomment.reply_comment == null){
        await commentController.addReplyComment(headcomment._id, comment._id)
        res.send({msg:`New Reply added : Comment id -> ${comment}`})
    }
    else{
        await commentController.addCommentEnd(headcomment._id, comment._id)
        res.send({msg:`New Reply added : Comment id -> ${comment}`})
    }
})


app.post('/similarity', async(req,res) => {
    var docs = await reportController.getReports(101)
    var sim_reports = await similarity.similarReports(docs[0],'bagofwords')
    //console.log(sim_reports)
    res.send(sim_reports)
})

/*
function loadPlugins(){
    //loadPlugin('/home/arjun/testPlugin', pluginManager)
   // loadPlugin('/home/arjun/testPlugin', pluginManager)
}
*/



app.listen(8001, () => {
    console.log("Application listening at port 8001...")
    //setTimeout(loadPlugins, 0)
    
    
    rl.prompt()
})
 