class BasePlugin{
    constructor(name,description, version,entry_point){

        this.name = name

        this.description = description

        this.version = version

        this.entry_point = entry_point

    }
}

module.exports = BasePlugin