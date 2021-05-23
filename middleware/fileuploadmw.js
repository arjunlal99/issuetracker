require('dotenv').config({path:"../.env"})
const fs = require('fs')
const aws = require('aws-sdk')
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

var s3 = new aws.S3()
module.exports = async (req,res,next) => {
    req.body.attachments = []
    req.files.forEach(file => {
        var filestream = fs.createReadStream(path)
        var params = {Bucket: "imgtorage", Key: file.filename + ".png", Body: fileStream, ACL: 'public-read'}
        s3.upload(params, (err,data) => {
            if (err){
                res.status(500).send({msg:"File upload failed"})
            }else{
                req.body.attachments.push(data.Location)
            }
        })
    })
    next()
}