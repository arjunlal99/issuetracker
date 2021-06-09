const { writeSync, openSync} = require('fs')
const {spawn} = require('child_process')

const reportController = require('../controllers/reportController.js')

console.log(rootDir)
/*
    Gather reports and write them to a temporary file
*/
async function tempReports(project_id, temp_file = "temp", index_file= "index"){
    let docs = await reportController.getReports(project_id)
    var file_descriptor = await openSync( rootDir + "/similarity/" + temp_file, flags = "w")
    var index_descriptor = await openSync(rootDir+ "/similarity/" +index_file, flags ="w")
    docs.forEach(async report => {
        var line = report._id + " " + report.description +" " + report.title + " " + report.type + " " + report.component + "\n"
        writeSync(index_descriptor,report._id+"\n")
        console.log(writeSync(file_descriptor,line))
    })
}

/*

*/
async function tempReport(report, output_file){
    var file_descriptor = await openSync(rootDir + "/similarity/" + output_file, flags="w")
    var line = report._id + " " + report.description +" " + report.title + " " + report.type + " " + report.component + "\n"
    console.log(writeSync(file_descriptor, line))
}

/*
    Retrieve relevant bag of words and write them to a temporary file
*/
async function bagOfWords(temp_file="temp", output_file="bagofwords"){
    return new Promise((resolve,reject) => {
        bag_of_words = spawn("/bin/python3", [rootDir + "/similarity/" +"bagofwords.py", rootDir + "/similarity/" + temp_file, rootDir + "/similarity/" + output_file])
        bag_of_words.stdout.on('data', data => {
            resolve(true)
        })
        bag_of_words.stderr.on('data', data => {
            console.log(data.toString())
        })
    })
}

/*

*/
async function similarReports(new_report, existing_reports="bagofwords",threshold=0.1){
    return new Promise(async (resolve, reject) => {
        tempReport(new_report,"newreport")
        await bagOfWords("newreport", "newbagofwords")
        console.log('here')
        similarity = spawn("/bin/python3", [rootDir + "/similarity/" + "similarity.py",rootDir + "/similarity/" + "newbagofwords",rootDir + "/similarity/" + existing_reports, threshold, rootDir])
        similarity.stdout.on('data', data => {
            //console.log('There')
            console.log(data.toString())
            resolve(data.toString())
        })
        similarity.stderr.on('data', data => {
            console.log(data.toString())
            return reject(data.toString())
        })
    })
}

/*
setTimeout(async () => {
    let docs = await reportController.getReports(101)
    //tempReport(docs[0], "newreport")
    //await bagOfWords("newreport", "newbagofwords")
    await similarReports(docs[0], "bagofwords")
},0)
*/

module.exports = {
    similarReports,
    tempReports
}



/*
similarity_script = spawn("python3", ["similarity.py"])

similarity_script.stdout.on('data', data => {
    console.log(`stdout (${similarity_script.pid}) : `, data.toString())
})

similarity_script.stderr.on('data', data => {
    console.log(`stdout (${similarity_script.pid}) : `, data.toString())
})

*/

/*
reportController.getReports(101).then(async docs => {
    var file_descriptor = await openSync("./temp", flags = "w")
    docs.forEach(async report => {
        var line = report._id + " " + report.description +" " + report.title + " " + report.type + " " + report.component + "\n"
        console.log(writeSync(file_descriptor,line))
    })
}).catch(err => {
    console.log(err)
})
*/