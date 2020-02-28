const fs = require('fs')
const http = require('http')

http
    .createServer((req, res) => {
        const url = req.url
        if (url === '/') {
            fs.readFile('./views/index.html', (err, data) => {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })
        } else if (url.indexOf('/public/') === 0) {
            fs.readFile('.' + url, (err, data) => {
                if (err) {
                    return console.log(`静态资源${url}未找到`)
                }
                res.end(data)
            })
        } else {    //未访问到添加404
            fs.readFile('./views/404.html', (err, data) => {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })

        }
    })
    .listen(3010, () => {
        console.log('running')
    })

/*
原因是浏览器在收到响应内容HTML时，从上到下开始解析， 当在解析过程中遇到：
link/script/img/iframe/video/audio等具有src或者href属性（a标签的href属性除外，只有点击时才会执行请求）时
浏览器会自动对这些资源再次发送请求

为了方便的统一这些静态资源，可与约定将所有的静态资源放于public目录中,并对这些请求进行处理。这样可以很灵活的控制哪些代码用户可以访问到（页面、public中的静态资源），哪些不能被用户访问到（例如app.js）
*/