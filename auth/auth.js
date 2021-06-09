const { pbkdf2Sync} = require('crypto')

//function to generate hash
function generateHash(payload){
    const key = pbkdf2Sync(payload, 'project', 10000, 32, 'sha256')
    return key.toString('hex')
}


module.exports = {
    generateHash
}

