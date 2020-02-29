const fs = require('fs')
const http = require('http')
const url = require('url')
const nunjucks = require('nunjucks')

let comments = [
    {
        name: '张三',
        message: '今天天气不错',
        dateTime: '2015-10-16'
    },
    {
        name: '张三2',
        message: '今天天气不错',
        dateTime: '2015-10-16'
    },
    {
        name: '张三3',
        message: '今天天气不错',
        dateTime: '2015-10-16'
    },
    {
        name: '张三4',
        message: '今天天气不错',
        dateTime: '2015-10-16'
    }
]

http
    .createServer((req, res) => {
        const parseObj = url.parse(req.url, true)
        const pathname = parseObj.pathname  //不包括url中?及后边内容
        if (pathname === '/') {
            fs.readFile('./views/index.html', (err, data) => {
                if (err) {
                    return res.end('404')
                }
                data = nunjucks.renderString(data.toString(), { comments })
                res.end(data)
            })
        } else if (pathname === '/post') {
            fs.readFile('./views/post.html', (err, data) => {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })

        } else if (pathname.indexOf('/public/') === 0) {
            fs.readFile('.' + pathname, (err, data) => {
                if (err) {
                    return console.log(`静态资源${pathname}未找到`)
                }
                res.end(data)
            })
        } else if (pathname === '/pinglun') {
            const comment = parseObj.query
            comment.dateTime = '2017-11-2 11:11:11'
            comments.push(comment)
            //服务器重定向至首页
            // 如何通过服务器让客户端重定向
            // 1、状态码设置为302临时重定向
            // 2、在响应头中通过Location高速客户端往哪儿重定向
            // 如果客户端发现收到服务器的响应状态码是302就会自动去响应头中找Location
            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
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