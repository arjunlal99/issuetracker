var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})

//Event Emitters
var pluginManager = require("../plugin/pluginManager.js")

const EventEmitter = require('events')
/*
    onNewReport event
*/
class CreateReport extends EventEmitter{
    addListener(callback){
        this.on('onNewReport', callback)
    }
}

const onNewReport = new CreateReport()

onNewReport.addListener((project_id, _id, reporter, title, description) => {
    pluginManager.emitEvents('reportController', 'onNewReport', [project_id, _id, reporter, title,description])
}) 


/*
    onFirstComment event
*/
class FirstComment extends EventEmitter{
    addListener(callback){
        this.on('onFirstComment',callback)
    }
}

const onFirstComment = new FirstComment()

onFirstComment.addListener((report_id,comment_id) => {
    pluginManager.emitEvents('reportController', 'onFirstComment', [report_id, comment_id])
})
/*
    onTriage event
*/
class Triage extends EventEmitter{
    addListener(callback){
        this.on('onTriage',callback)
    }
}

const onTriage = new Triage()

onTriage.addListener((id, triager, status, priority, labels, assigned_to, attachments) => {
    pluginManager.emitEvents('reportController', 'onTriage', [id, triager, status, priority, labels, assigned_to, attachments])
})

var reportSchema = require('../models/report.js')
const { report } = require('process')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false})
conn.once('open', async() => {
    console.log('Report Connection Established')
    //createReport(101,"linux","bug",1,'anjaly','test','test',1).then((docs) => console.log(docs)).catch((err) => console.log(err))
})

var reportModel = conn.model('reports', reportSchema)
 /*
    Function to create new report
    
*/

function createReport( project_id, platforms, type, priority, reporter, component, title, description, version,labels=[], assigned_to=null,first_comment=null, attachments=null){
    return new Promise((resolve, reject) => {
            reportobj = {
            project_id : project_id,
            platforms : platforms,
            type : type,
            labels : labels,
            reporter : reporter,
            component : component,
            assigned_to : assigned_to,
            title : title,
            description : description,
            version : version,
        }
        if(priority){
            reportobj.priority = priority
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
                onNewReport.emit('onNewReport', docs.project_id,docs._id, docs.reporter, docs.title, docs.description)
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

            else{
                resolve(docs)
            }    
        })
    })
}

/*
   Function to check if a report exists
*/
function reportCheck(id){
    return new Promise((resolve,reject) => {
        reportModel.exists({_id: id}, (err,docs) => {
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
    Function to retireve all reports
*/

function getAllreports(){
    return new Promise((resolve,reject) => {
        reportModel.find({},(err,docs)=>{
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
   Function to add firstComment
   id: report_id  comment:comment_id
*/
function addComment(id,comment){
    return new Promise(async (resolve,reject) => {
        var report = await reportModel.findOne({_id : id})
        report.first_comment=comment
        report.save((err,docs) => {
            if(err){
                return reject(err)
            }
            else{
                onFirstComment.emit('onFirstComment',id,comment)
                resolve(docs)
            } 
        })
    })
} 

/*
  Function to triage a report
*/
//component fix
function triage(id, triager, status = null, priority = 0, labels = null, assigned_to = null, attachments = null){
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
            if(report.assigned_to){
                report.assigned_to.push(assigned_to)
            }
            else report.assigned_to=assigned_to
        }
        if(attachments){
            report.attachments.push(attachments)
        }
        report.save((err,docs) => {
            if(err){
                return reject(err)
            }
            else{
                onTriage.emit('onTriage',id, triager, status, priority, labels, assigned_to, attachments)
                resolve(docs)
            }
        })
    })
}

function healthCheck(){
    return conn.readyState
}


module.exports = {
   createReport,
   getReportbyId,
   getAllreports,
   getReports,
   triage,
   reportCheck,
   addComment,
   onNewReport,
   healthCheck
}