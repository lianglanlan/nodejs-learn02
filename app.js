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
/*
原因是浏览器在收到响应内容HTML时，从上到下开始解析， 当在解析过程中遇到：
link/script/img/iframe/video/audio等具有src或者href属性（a标签的href属性除外，只有点击时才会执行请求）时
浏览器会自动对这些资源再次发送请求
*/