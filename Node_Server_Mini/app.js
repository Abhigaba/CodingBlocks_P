const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
    console.log(req.url);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let file = ''
    if (req.url == '/'){
        file = 'about.html'
    }
    else if (req.url == '/like'){
        file = 'like.html'   
    }
    else {
        file = 'index.html'
    }
    fs.readFile(file, (err, data) => {
        if (err){throw err}
        res.end(data)
    })
})


server.listen(8080, (err) => {
    if (err) {throw err}
    console.log('Server Listening on: ', 8080)
})