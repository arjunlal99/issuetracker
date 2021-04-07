var crypto = require('crypto')
var hash = crypto.createHash('sha256')

//function to generate hash
function generateHash(data){
    hash_update = hash.update(data, 'utf-8')
    return hash_update.digest('hex')
}


module.exports = {
    generateHash
}