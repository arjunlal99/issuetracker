var mongoose = require('mongoose')

var Schema = mongoose.Schema

var commentSchema = new Schema({
	timestamp: {type: Date, default: Date.now},
	user: {type: String, required: true},
	comment : String,
	next_comment: {type: String, default: null},
	reply_comment: {type: String, default: null},
	attachments : {type: [String], default: null}
})

module.exports = commentSchema
