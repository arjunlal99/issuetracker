var mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})
var commentSchema = require('../models/comment.js')

var conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: true})

conn.once('open', async () => {
	console.log('Comment Connection Established')
   // addNextComment("60851209e3dfc41d06cbb0ca","6085745beefc403f0d293e6f").then((docs) => console.log(docs)).catch((err) => console.log(err))
//	getNextCommentId("60851209e3dfc41d06cbb0ca").then((docs) => console.log(docs)).catch((err) => console.log(err))
   // getNextCommentId("").then((docs) => console.log(docs)).catch((err) => console.log(err))
  // doesExist("60851209e3dfc41d06cbb0ca").then((docs) => console.log(docs)).catch((err) => console.log(err))
})

var commentModel = conn.model('comments', commentSchema)

/*
	Function to create a new comment(_id set by mongoose is used for comment_id)
*/

function createComment(user, comment, files=null){
	return new Promise((resolve, reject) => {
        commentObj = {
            user: user,
            comment: comment
        }

        if (files){
            commentObj.files = files
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


module.exports = {
	createComment,
	getCommentById,
	addNextComment,
	addReplyComment,
    getNextCommentId,
    getReplyCommentId,
	doesExist
}