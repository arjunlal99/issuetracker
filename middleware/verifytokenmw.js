const userController = require("../controllers/userController.js")
const {verifyJwt} = require("../auth/jwt.js")

module.exports = async (req,res,next) => {
    if (!req.headers.authorization){
        res.send("Auth Token not found")
    }else{
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(" ")
        verifyJwt(token[1]).then((decoded) => {
            console.log("Successfully verified : ", decoded)
            next()
        }).catch((err) => {
            res.send("Invalid auth token")
        })
    }
}