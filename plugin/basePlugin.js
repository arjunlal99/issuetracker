class BasePlugin{
    constructor(name,description, version,entry_point, permissions){

        this.name = name

        this.description = description

        this.version = version

        this.entry_point = entry_point

        this.permissions = permissions

        process.on('message',message => {
            if (message.controller in this.permissions){
                //console.log(this.permissions[message.controller])
                if (this.permissions[message.controller].includes(message.eventname)){
                    //console.log(this)
                    //console.log(message.eventname)
                    var eventargs = [message.eventname]
                    eventargs.push.apply(eventargs,message.args)
                    //console.log(eventargs)
                    //console.log(message.args)
                    this[message.controller][message.eventname].emit.apply(this[message.controller][message.eventname], eventargs)
                }
        }
        })
        
    }
}



module.exports = BasePlugin