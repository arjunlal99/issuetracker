var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})

//Event Emitters
var pluginManager = require("../plugin/pluginManager.js")

const EventEmitter = require('events')

/*
	onComment event
*/
class Comment extends EventEmitter{
	addListener(callback){
		this.on('onComment', callback)
	}
}

/*
	onReply event
*/


var commentSchema = require('../models/comment.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: true})

conn.once('open', async () => {
	console.log('Comment Connection Established')
})

var commentModel = conn.model('comments', commentSchema)

/*
	Function to create a new comment(_id set by mongoose is used for comment_id)
*/

function createComment(user, comment, attachments=null){
	return new Promise((resolve, reject) => {
        commentObj = {
            user: user,
            comment: comment
        }

        if (attachments){
            commentObj.attachments = attachments
        }

		var commentInstance = new commentModel(commentObj)

		commentInstance.save((err,docs) => {
			if (err){
				return reject(err)
			}
			else{
				resolve(docs)
			}
		})
	})	
}

function doesExist(id){
    return new Promise((resolve,reject) => {
        commentModel.exists({_id : id}, (err,docs) => {
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
	Function to retrieve a comment by id
*/

function getCommentById(id){
	return new Promise((resolve, reject) => {
		commentModel.findOne({_id: id}, (err,docs) => {
			if (err){
				return reject(err)
			}
			else{
				resolve(docs)
			}
		})
	})
}

function getNextCommentId(id){
    return new Promise((resolve,reject) => {
        commentModel.findOne({_id: id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs.next_comment)
            }
        })
    })
}

function getReplyCommentId(id){
    return new Promise((resolve,reject) => {
        commentModel.findOne({_id: id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs.reply_comment)
            }
        })
    })

}
/*
	Function to add next_comment by id
*/

function addNextComment(id, new_comment_id){
	return new Promise(async (resolve, reject) => {
		var comment = await getCommentById(id)
		comment.next_comment = new_comment_id
		comment.save((err,docs) => {
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
	Function to add reply_comment by id
*/

function addReplyComment(id, new_comment_id){
	return new Promise(async (resolve,reject) => {
		var comment = await getCommentById(id)
		comment.reply_comment = new_comment_id
		comment.save((err,docs) => {
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
	Funcion to add comment to end of a chain given a comment_id
*/
function addCommentEnd(id, new_comment_id){
	return new Promise(async (resolve,reject) => {
		var curr_comment = await commentModel.findOne({_id: id})
		
		while (curr_comment.next_comment != null){
			curr_comment = await commentModel.findOne({_id : curr_comment.next_comment})
		}

		curr_comment.next_comment = new_comment_id
		curr_comment.save((err,docs) => {
			if (err){
				return reject(err)
			}else{
				resolve(docs)
			}
		})
	})
}

function healthCheck(){
    return conn.readyState
}


module.exports = {
	createComment,
	getCommentById,
	addNextComment,
	addReplyComment,
    getNextCommentId,
    getReplyCommentId,
	addCommentEnd,
	doesExist,
	healthCheck
}