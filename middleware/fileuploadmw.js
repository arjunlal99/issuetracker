
require('dotenv').config({path:"../.env"})
const fs = require('fs')

const aws = require('aws-sdk')
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

var s3 = new aws.S3()
module.exports = async (req,res,next) =>{
    req.body.attachments = []
    if(req.files){
        for(const file of req.files){
            console.log("files are present")
            var filestream = fs.createReadStream(file.path)
            var params = {Bucket: "imgtorage", Key: file.filename + ".png", Body: filestream, ACL: 'public-read'}
            var link = await new Promise((resolve,reject) => {
                s3.upload(params,(err,data) => {
                    if(err){
                        res.status(500).send({msg:"File upload failed"})
                    }
                    else{
                        resolve(data.Location)
                        console.log(data.Location)
                    }
                })
            })
            req.body.attachments.push(link)


        }
        console.log(req.body.attachments)
        next()
    }

    else{
        console.log("No files to upload")
        req.body.attachments = []
        next()
    }

}
