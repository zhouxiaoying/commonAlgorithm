var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    if (req.url == '/test1') {
        setTimeout(function() {
            res.end("console.log('test1');");
        }, 1000 * 5);
    } else if (req.url == '/test2') {
        setTimeout(function() {
            res.end("console.log('test2');");
        }, 1000 * 3);
    } else {
        res.end("console.log('test3');");
    }
    // res.end('Hello World\n');
}).listen(8081, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8081/'); 