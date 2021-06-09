const {kill} = require('process')

class pluginManager{
    //List of all instances
    static pluginInstances = []
    constructor(){
        
    }
    //Add new instance to list
    add(pluginInstance, temp_id){
       pluginManager.pluginInstances.push({
           pluginInstance: pluginInstance,
           temp_id: temp_id,
           status: "Running"
       })
       //Listen to messages from child process
       pluginInstance.on('message', m => {
           console.log(m)
       })
       //Listen for plugin process exiting
       pluginInstance.on('exit', code => {
           this.changeStatus(pluginInstance, "Exited")
           console.log("Exited", pluginInstance.pid, `(code : ${code})`)
       })
    }
//Change status of a plugin instance
    changeStatus(pluginInstance, new_status){
        pluginManager.pluginInstances.forEach(instance => {
            if (pluginInstance == instance.pluginInstance){
                instance.status = new_status
                return pluginInstance.pid
            }
        })
    }
//kill plugin instance by killing the process
    stopInstance(pid){
        kill(pid)
    }

    display(){
        console.log(`PID  TEMPID          STATUS`)
        pluginManager.pluginInstances.forEach(instance => {
            console.log(instance.pluginInstance.pid, instance.temp_id, instance.status)
        })

    }
//broadcast event information to all plugin process
    emitEvents(controller: String,eventname: String, args){
        pluginManager.pluginInstances.forEach(instance => {
            if (instance.status == "Running"){
                instance.pluginInstance.send({controller:controller, eventname: eventname, args: args})
            }
        })
    }
}

var manager = new pluginManager()

module.exports = manager