require('dotenv').config({path:'../.env'})
const userController = require('../controllers/userController.js')

//const projectController = require('../controllers/projectController.js')

const apiIndex = {
    "userController":{
        "signUp": userController.signUp,
        "usernameCheck": userController.usernameCheck,
        "emailCheck": userController.emailCheck,
        "passwordCheck": userController.passwordCheck,
        "onUsernameCheck": userController.onUsernameCheck
    },
    "projectController":{

    }
}


module.exports = apiIndex