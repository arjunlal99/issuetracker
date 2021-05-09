var pluginManager = /** @class */ (function () {
    function pluginManager() {
        pluginManager.pluginInstances = [];
    }
    pluginManager.prototype.add = function (pluginInstance, temp_id) {
        pluginManager.pluginInstances.push({
            pluginInstance: pluginInstance,
            temp_id: temp_id,
            status: "Running"
        });
        pluginInstance.on('message', function (m) {
            console.log(m);
        });
    };
    pluginManager.prototype.display = function () {
        pluginManager.pluginInstances.forEach(function (instance) {
            console.log(instance.pluginInstance.pid, instance.temp_id, instance.status);
        });
    };
    pluginManager.prototype.emitEvents = function () {
    };
    pluginManager.pluginInstances = [];
    return pluginManager;
}());
var manager = new pluginManager();
module.exports = manager;
