class pluginManager{
    static pluginInstances = []
    constructor(){
        pluginManager.pluginInstances = []
    }

    add(pluginInstance, temp_id){
       pluginManager.pluginInstances.push({
           pluginInstance: pluginInstance,
           temp_id: temp_id,
           status: "Running"
       })

       pluginInstance.on('message', m => {
           console.log(m)
       })
    }

    display(){
        pluginManager.pluginInstances.forEach(instance => {
            console.log(instance.pluginInstance.pid, instance.temp_id, instance.status)
        })

    }

    emitEvents(){
        
    }
}

var manager = new pluginManager()

module.exports = manager