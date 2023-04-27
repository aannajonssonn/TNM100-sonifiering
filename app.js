// https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
/*var http = require('http'),
    fs = require('fs')


fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"})  
        response.write(html)  
        response.end()  
    }).listen(8000)
})*/

// https://www.section.io/engineering-education/rendering-html-pages-as-a-http-server-response-using-node-js/
const express = require("express")
const app = express()
const bodyParser = require('body-parser')

app.listen(3000, () => {
    console.log("Application started and Listening on port http://127.0.0.1:3000/")
})

// serve your css as static
app.use(express.static(__dirname))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
const jsonParser = bodyParser.json()
app.post("/data", jsonParser, async (req, res) => {
    const data = req.body // Read the body of the sent message
    console.log(data.value) // Log the actual value
    res.json(data.value) // Send back the value (to not crash)
})