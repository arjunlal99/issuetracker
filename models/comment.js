var mongoose = require('mongoose')

var Schema = mongoose.Schema

var commentSchema = new Schema({
	comment_id : {type: Number, required : true, unique: true},
	timestamp: {type: Date, default: Date.now},
	user: {type: String, required: true},
	comment: String,
	next_comment: String,
	reply_comment: String
})

module.exports = commentSchema
