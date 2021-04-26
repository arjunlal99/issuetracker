var mongoose = require('mongoose')
require('dotenv').configv({path:'../.env'})
var reportSchema = require('../models/report.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false})
conn.once('open', async() => {
    console.log('Report Connection Established')
})


var reportModel = conn.model('reports', reportSchema)
 
/*
    Function to create new report
    
*/
function createReport(report_id, project_id, platforms, components, type, status, priority, labels, reporter, assigned_to, last_modified, title, description, version, first_comment, attachments){
    return new Promise((resolve, reject) => {
        var reportInstance = new  reportModel({
            report_id :  report_id,
            project_id : project_id,
            platforms : platforms,
            components : components,
            type : type,
            status : status,
            priority : priority,
            labels : labels,
            reporter : reporter,
            assigned_to : assigned_to,
            last_modified : last_modified,
            title : title,
            description : description,
            version : version,
            first_comment : first_comment,
            attachments : attachments
        })

        reportInstance.save((err,docs) => {
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
   Function to retrieve report using report_id
*/
function getReportbyId(report_id){
    return new Promise((resolve,reject) => {
        reportModel.findOne({report_id: report_id},(err,docs)=>{
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}
/*
    Function to retrieve reports of a project using project_id
*/
function getReports(project_id){
    return new Promise((resolve,reject) => {
        reportModel.find({project_id: project_id},(err, docs) =>{
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}
/*
  Function to add attachments to the report
*/
function addAttachments(report_id, attachments){
    return new Promise((resolve,reject) => {
        var report = await reportModel.findOne({report_id: report_id})
        report.attachments.push(attachments)
        report.save((err,docs) => {
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}
/*
  Function to add assigned_to to the report
*/
function addAssigned_to(report_id, assigned_to){
    return new Promise((resolve,reject) => {
        var report = await reportModel.findOne({report_id: report_id})
        report.assigned_to.push(assigned_to)
        report.save((err,docs) => {
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}
/*
  Function to change status of a report
*/
function changeStatus(report_id, status){
    return new Promise((resolve,reject) => {
        var report = await reportModel.findOne({report_id: report_id})
        report.status = status
        report.save((err,docs) => {
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}

/*
  Function to set priority of a report
*/
function setPriority(report_id, priority){
    return new Promise((resolve,reject) => {
        var report = await reportModel.findOne({report_id: report_id})
        report.priority = priority
        report.save((err,docs) => {
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
    })
}
/*
   Function to delete a report
*/
function deleteReport(report_id){
    return new Promise((resolve, reject) => {
        reportModel.findOneAndRemove({report_id : report_id}, (err, docs) => {
            if(err){
                return reject(err)
            }
            else resolve(docs)
        })
      
    })
}


module.exports = {
   createReport,
   getReportbyId,
   getReports,
   addAttachments,
   addAssigned_to,
   changeStatus,
   setPriority, 
   deleteReport
}