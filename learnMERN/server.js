require('dotenv').config()
const express = require('express')
const app = express()
// path模块提供了一组实用工具，用于处理文件和目录的路径。
const path = require('path')
const PORT = process.env.PORT || 3500
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')

console.log(process.env.MONGODB_URL)
connectDB()
// app.use('/', ***)
// app.use(): 这是Express应用程序对象的一个方法，用于将中间件函数绑定到应用程序的路径上。
// '/': 这是中间件函数将被绑定到的路径。在这个例子中，中间件函数将会处理应用程序根路径。

// express.static(...): 这是Express框架提供的一个中间件函数，用于提供静态文件服务。它会将指定目录下的文件发送给客户端，以便客户端可以直接访问这些文件而无需通过路由处理程序。
// path.join(__dirname, '/public'): 这一部分是为了得到静态文件所在的绝对路径。__dirname是一个Node.js中的全局变量，表示当前执行脚本所在的目录。path.join()方法用于将多个路径拼接成一个路径。在这里，它的作用是将当前执行脚本的目录与'/public'拼接起来，得到静态文件所在的绝对路径。
app.use('/', express.static(path.join(__dirname, '/public')))

// require('./routes/root')：这是 Node.js 中的 require 函数，用于导入其他模块。它会加载当前目录下的 'routes' 文件夹中的 'root.js' 文件，并返回该文件导出的对象或函数。
// './routes/root'：这是要加载的模块的相对路径。在这个例子中，它指定了一个名为 'root.js' 的文件，位于当前执行脚本的 'routes' 文件夹内。
app.use('/', require('./routes/root.js'))

// app.all('*')：这里使用了 Express 应用程序对象的 .all() 方法，它表示匹配所有的 HTTP 方法（GET、POST、PUT、DELETE等）。参数 ' * ' 是一个通配符，表示匹配所有路径。
// 目前假设我们只返回404代码和错误页面
app.all('*', (req, res) => {
    // res.status(404)：设置响应状态码为 404，表示请求的资源未找到。
    res.status(404)
    // 根据客户端请求的不同类型来发送不同类型的响应。Express 的 req.accepts() 方法用于检查客户端能够接受的响应类型。
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(logger)
app.use(errorHandler)
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})