const pluginManager = require("./plugin/pluginManager.js")
const loadPlugin = require("./plugin/pluginLoader.js")
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
        case "":
            break

        case "status":
            console.log(data[1], "status")
            break

        case "plugin":
            pluginManager.display()
            break

        case "load":
            loadPlugin(data[1], pluginManager)
            break

        case "kill":
            pluginManager.stopInstance(data[1])
    }       
    rl.prompt()
})

module.exports = rl