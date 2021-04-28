var express = require('express')
var app = express()
require('dotenv').config()
var cookieParser = require('cookie-parser')

var jwt = require('./auth/jwt.js')

//var loadPlugin = require('./plugin/pluginLoader.js')

//importing controllers
var userController = require('./controllers/userController.js')
var projectController = require('./controllers/projectController.js')
var reportController = require('./controllers/reportController.js')

//importing middleware
var userCheck = require('./middleware/userCheckmw.js')
var usernameCheck = require('./middleware/usernameCheckmw.js')
var passwordCheck = require('./middleware/passwordCheckmw')
var projectCheck = require('./middleware/projectCheckmw.js')

app.get('/helloworld', (req,res) => {
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
    res.cookie('token', token)
    res.send({msg: 'Auth Token Cookie set successfully'})

})
/*
   Endpoint to get project by id
*/
app.get('/project/:id', projectCheck, async(req,res) => {
    var response = await projectController.getProjectbyId(req.params.id)
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
   Endpoint to see all reports of a project
*/
app.get('/report/',async(req,res) => {
    var response = await reportController.getAllreports()
    res.send({msg: `Reports : ${response}`})
})

/*
    Endpoint to get report using project ID

app.get('/report/:project_id',async(req,res) => {
    var response = await reportController.getReports(req.params.project_id)
    res.send({msg: `Reports : ${response}`})
})

*/


app.post('/createProject',projectCheck, async (req,res) => {
    var response = await projectController.createProject(req.body.project_id, req.body.project_name, req.body.components, req.body.repository, req.body.triagers, req.body.platforms)
    res.send({msg: `New Project created: Project id -> ${response.project_id}, Project name -> ${response.project_name}`})
})


/*
function loadPlugins(){
    loadPlugin('/home/arjun/testPlugin')
}
*/
app.listen(8001, () => {
    console.log("Application listening at port 8001...")
   // setTimeout(loadPlugins, 10000)
})