var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})
var projectSchema = require('../models/project.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false})
conn.once('open', async() => {
    console.log('Project Connection Established')
})

var projectModel = conn.model('projects', projectSchema)

/*
    Function to create new project
    
*/
function createProject(project_id, project_name, components, repository, triagers, platforms){
    return new Promise((resolve, reject) => {
        var projectInstance = new projectModel({
            project_id : project_id,
            project_name: project_name,
            components: components,
            repository: repository,
            triagers: triagers,
            platforms: platforms
        })

        projectInstance.save((err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })
    })
}

/*
    Function to retrieve project name using project id
*/

function getProjectbyId(project_id){

}

/*
    Function to check if project exists
*/

function projectCheck(project_id){

}

/*
    Function to retireve all projects
*/

function getAllprojects(){

}

/*
    Function to add new triager to a project
*/

function addTriager(project_id, username){

}

/*
    Function to get list of all triagers for a project
*/

function getTriagers(project_id){

}