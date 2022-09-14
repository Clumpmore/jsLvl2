const http = require('http');
const fs = require('fs')
const server = http.createServer((req, res) => {
    console.log(req.url)
    const body = req.url === '/style.css'
        ? fs.readFileSync('./public/style.css')
        : fs.readFileSync('./public/index.html')
    res.end(body)

});
const port = process.env.PORT || 3000
server.listen(port);

console.log(`server started on port ${port}!`);
