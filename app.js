const fs = require('fs')
const http = require('http')

http
    .createServer((req, res) => {
        const url = req.url
        console.log(url)
        if (url === '/') {
            fs.readFile('./views/index.html', (err, data) => {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })
        }
    })
    .listen(3010, () => {
        console.log('running')
    })

//这时候在node中执行app.js，在浏览器中打开 http://localhost:3010/ 会发现浏览器一直处于请求中