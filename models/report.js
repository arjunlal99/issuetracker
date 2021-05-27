var mongoose = require('mongoose')

var Schema = mongoose.Schema

var reportSchema = new Schema({
    project_id :  {type: Number, required: true},
    platforms : [String],
    type : String,
    status : {type: String, default: 'new' },
    priority :{type: Number, default: 5},
    labels : [String],
    reporter : String,
    component : String,
    assigned_to : [String],
    last_modified : {type: Date, default: Date.now()},
    title : String,
    description : String,
    version : Number,
    first_comment : {type: String, default: null},
    attachments : [String]
})

module.exports = reportSchema