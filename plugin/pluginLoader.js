const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const {spawn, fork} = require('child_process')


/*
    function to load plugin directory into app directory
     --> Path should be the absolute path

*/

function loadPlugin(pluginPath,pluginManager){
    if (fs.existsSync(pluginPath)){
        
        if (fs.existsSync(pluginPath + '/manifest.json')){

            console.log("Plugin recognized")
            console.log(path.dirname(module.parent.filename))
            
            var tempDirectory = genTempDirectory()
            fs.mkdirSync(path.dirname(module.parent.filename) + '/plugin/temp/' + tempDirectory)
            fse.copySync(pluginPath, path.dirname(module.parent.filename) + '/plugin/temp/' + tempDirectory )
           
            var manifest = fs.readFileSync( path.dirname(module.parent.filename) + '/plugin/temp/' + tempDirectory + '/manifest.json')
            manifest = JSON.parse(manifest)
            
            console.log(manifest.entry_point)

            //require(path.dirname(module.parent.filename) + '/plugin/temp/' + tempDirectory + '/' + manifest.entry_point)

            //creates new fork for an extension instance
            var extensionInstance = fork(path.dirname(module.parent.filename) + '/plugin/temp/' + tempDirectory + '/' + manifest.entry_point,[],{silent:true})
            pluginManager.add(extensionInstance, tempDirectory)
            //pluginManager.display()
            extensionInstance.stdout.on('data', data => {
                console.log(`stdout (${extensionInstance.pid}) : `, data.toString())
            })
            extensionInstance.stderr.on('data', data => {
                console.log(`stderr (${extensionInstance.pid}) : `, data.toString())
            })
        }
        else{
            console.log("Unable to recognise plugin")
        }

    }
    else{
        console.log("Path doesn't exist")
    }
}

/*
    Function used to generate a random name for directory in temp
*/

function genTempDirectory(len = 15){
    var text = ""

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i<len ; i++ ){
        text += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    return text
}

//loadPlugin('/home/arjun/testPlugin')

module.exports = loadPlugin