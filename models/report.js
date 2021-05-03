var mongoose = require('mongoose')

var Schema = mongoose.Schema

var reportSchema = new Schema({
    project_id :  {type: Number, required: true},
    platforms : [String],
    type : String,
    status : String,
    priority : Number,
    labels : [String],
    reporter : String,
    assigned_to : [String],
    last_modified : {type: Date, default: Date.now()},
    title : String,
    description : String,
    version : Number,
    component: String,
    first_comment : {type: String, default: null},
    attachments : {type: [String], default: null}
})

module.exports = reportSchema