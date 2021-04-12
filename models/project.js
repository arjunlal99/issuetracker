var mongoose = require('mongoose')

var Schema = mongoose.Schema

var projectSchema = new Schema({
    project_id : {type: Number, required: true, unique: true},
    project_name: {type: String, required: true},
    components: [String],
    repository: String,
    triagers: [String],
    platforms: [String]
})

module.exports = projectSchema
