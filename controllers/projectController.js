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
    return new Promise((resolve,reject) => {
        projectModel.findOne({project_id:project_id},(err,docs)=>{
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}

/*
    Function to check if project exists
*/

function projectCheck(project_id){
    return new Promise((resolve,reject) => {
        projectModel.exists({project_id: project_id}, (err,docs) => {
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
    Function to retireve all projects
*/

function getAllprojects(){
    return new Promise((resolve,reject) => {
        projectModel.find({},(err,docs)=>{
            if(err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })

    })

}

/*
    Function to add new triager to a project (Assuming triager is not already in the array)
*/

function addTriager(project_id, username){
    return new Promise(async (resolve,reject) => {
        var project = await projectModel.findOne({project_id: project_id})
        project.triagers.push(username)
        project.save((err,docs) => {
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
    Function to get list of all triagers for a project
*/

function getTriagers(project_id){
    return new Promise((resolve,reject) => {
        projectModel.findOne({project_id: project_id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs.triagers)
            }
        })
    
    })

}

/*
    Function to check if a user is already a triager for a project
    --> Should resolve true if user already exists, false if not
*/

function isTriager(project_id, username){
    return new Promise((resolve,reject) => {
        projectModel.findOne({project_id: project_id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            if(docs.triagers.includes(username)){
                resolve(true)
            }else{
                resolve(false)
            }
        })   
    })
}


/*
    Function to add a component to a project
*/

function addComponent(project_id, component){

}

/*
    Function to check if a component is present in project
*/

function isComponent(project_id, component){
    return new Promise((resolve,reject) => {
        projectModel.findOne({project_id: project_id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            if(docs.components.includes(component)){
                resolve(true)
            }else{
                resolve(false)
            }
        })   
    })

}
/*
    Function to check if a platform exist for a project
*/
function isPlatform(project_id, platform){
    return new Promise((resolve,reject) => {
        projectModel.findOne({project_id: project_id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            if(docs.platforms.includes(platform)){
                resolve(true)
            }else{
                resolve(false)
            }
        })   
    })
}

module.exports = {
    
    createProject,
    projectCheck,
    getProjectbyId,
    getAllprojects,
    getTriagers,
    addTriager,
    isPlatform,
    isComponent
    
}
