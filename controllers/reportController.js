var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})
var reportSchema = require('../models/report.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false})
conn.once('open', async() => {
    console.log('Report Connection Established')
})


var reportModel = conn.model('reports', reportSchema)
 
/*
    Function to create new report
    
*/
function createReport( project_id, platforms, type, status, priority, labels, reporter, assigned_to, title, description, version, first_comment=null, attachments=null){
    return new Promise((resolve, reject) => {
            reportobj = {
            project_id : project_id,
            platforms : platforms,
            type : type,
            status : status,
            priority : priority,
            labels : labels,
            reporter : reporter,
            assigned_to : assigned_to,
            title : title,
            description : description,
            version : version,
        }
        if(first_comment){
            reportobj.first_comment = first_comment
        }
        if(attachments){
            reportobj.attachments = attachments
        }
        var reportInstance = new reportModel(reportobj)

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
function getReportbyId(id){
    return new Promise((resolve,reject) => {
        reportModel.findOne({_id: id},(err,docs)=>{
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
  Function to triage a report
*/
function triage(id, status = null, priority = 0, labels = null, assigned_to = null, attachments = null){
    return new Promise(async (resolve,reject) => {
        var report = await reportModel.findOne({_id : id})
        if(status){
            report.status = status
        }
        if(priority){
            report.priority = priority
        }
        if(labels){
            report.labels.push(labels)
        }
        if(assigned_to){
            report.assigned_to.push(assigned_to)
        }
        if(attachments){
            report.attachments.push(attachments)
        }
        report.save((err,docs) => {
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
   triage
   
}