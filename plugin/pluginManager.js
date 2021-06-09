var kill = require('process').kill;
var pluginManager = /** @class */ (function () {
    function pluginManager() {
    }
    //Add new instance to list
    pluginManager.prototype.add = function (pluginInstance, temp_id) {
        var _this = this;
        pluginManager.pluginInstances.push({
            pluginInstance: pluginInstance,
            temp_id: temp_id,
            status: "Running"
        });
        //Listen to messages from child process
        pluginInstance.on('message', function (m) {
            console.log(m);
        });
        //Listen for plugin process exiting
        pluginInstance.on('exit', function (code) {
            _this.changeStatus(pluginInstance, "Exited");
            console.log("Exited", pluginInstance.pid, "(code : " + code + ")");
        });
    };
    //Change status of a plugin instance
    pluginManager.prototype.changeStatus = function (pluginInstance, new_status) {
        pluginManager.pluginInstances.forEach(function (instance) {
            if (pluginInstance == instance.pluginInstance) {
                instance.status = new_status;
                return pluginInstance.pid;
            }
        });
    };
    //kill plugin instance by killing the process
    pluginManager.prototype.stopInstance = function (pid) {
        kill(pid);
    };
    pluginManager.prototype.display = function () {
        pluginManager.pluginInstances.forEach(function (instance) {
            console.log("PID  TEMPID          STATUS");
            console.log(instance.pluginInstance.pid, instance.temp_id, instance.status);
        });
    };
    //broadcast 
    pluginManager.prototype.emitEvents = function (controller, eventname, args) {
        pluginManager.pluginInstances.forEach(function (instance) {
            if (instance.status == "Running") {
                instance.pluginInstance.send({ controller: controller, eventname: eventname, args: args });
            }
        });
    };
    //List of all instances
    pluginManager.pluginInstances = [];
    return pluginManager;
}());
var manager = new pluginManager();
module.exports = manager;
