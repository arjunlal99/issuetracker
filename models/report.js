var mongoose = require('mongoose')

var Schema = mongoose.Schema

var reportSchema = new Scheme({
    report_id :  {type: Number, required: true, unique: true},
    project_id :  {type: Number, required: true},
    platforms : [String],
    components : [String],
    type : String,
    status : String,
    priority : Number,
    labels : [String],
    reporter : [String],
    assigned_to : [String],
    last_modified : Date,
    title : String,
    description : String,
    version : Number,
    first_comment : String,
    attachments : [String]
})

module.exports = reportSchema