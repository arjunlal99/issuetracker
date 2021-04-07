var express = require('express')
var app = express()

app.get('*', (req,res) => {
    res.send(req.method)
})

app.post('/api/signup', (req,res) => {

})


app.listen(8001, () => console.log("Application listening at port 8001..."))