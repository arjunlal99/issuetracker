const { writeSync, openSync} = require('fs')
const {spawn} = require('child_process')

const reportController = require('../controllers/reportController.js')

reportController.getReports(101).then(async docs => {
    var file_descriptor = await openSync("./temp", flags = "w")
    docs.forEach(async report => {
        var line = report.description +" " + report.title + " " + report.type + " " + report.component + "\n"
        console.log(writeSync(file_descriptor,line))
    })
}).catch(err => {
    console.log(err)
})

/*
similarity_script = spawn("python3", ["similarity.py"])

similarity_script.stdout.on('data', data => {
    console.log(`stdout (${similarity_script.pid}) : `, data.toString())
})

similarity_script.stderr.on('data', data => {
    console.log(`stdout (${similarity_script.pid}) : `, data.toString())
})

*/
