const pluginManager = require("../plugin/pluginManager.js")

const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>>>'
})

rl.on('line', data => {
    data = data.split(' ')
    switch(data[0]){
        default:
            console.log("Invalid Command")
            break
        
        case "status":
            console.log(data[1], "status")
            break

        case "plugin":
            pluginManager.display()
    }
    rl.prompt()
})

module.exports = {
    rl,
    pluginManager

}