const fs = require('fs')
const path = require('path')
require('dotenv').config({path:'../.env'})
var apiIndex = require('./apiIndex')
var BasePlugin = require('./basePlugin.js')



module.exports = function() {
    //read manifest.json of the calling plugin and parse it into JSON object
    var manifest = fs.readFileSync(path.dirname(module.parent.filename) + '/manifest.json')
    manifest = JSON.parse(manifest)
    
    //create new BasePluginInstance using info from manifest.json
    var BasePluginInstance = new BasePlugin(manifest.name, manifest.description, manifest.version, manifest.entry_point, manifest.permissions)

    for(var core in manifest.permissions){

        BasePluginInstance[core] = {}
        
        for(var func in manifest.permissions[core]){
            //console.log(manifest.permissions[core][func])
            BasePluginInstance[core][manifest.permissions[core][func]] = apiIndex[core][manifest.permissions[core][func]]
           // console.log(BasePluginInstance.userController)
        }
        
    }
    
    return BasePluginInstance
    
}