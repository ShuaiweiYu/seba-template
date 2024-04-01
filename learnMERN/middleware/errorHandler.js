const { logEvents } = require('./logger')
// ./logger：引入了名为 logEvents 的函数，用于记录日志。

// 定义 errorHandler 函数：这是一个 Express.js 中间件函数，用于处理请求过程中产生的错误。
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)
    // 当有错误发生时，调用 logEvents 函数记录错误信息到名为 'errLog.log' 的日志文件中，同时记录了错误名称、错误消息、请求方法、请求 URL 和请求来源。

    const status = res.statusCode ? res.statusCode : 500 // server error
    res.status(status)
    // 获取响应的状态码，如果响应中存在状态码则使用该状态码，否则默认使用 500 表示服务器内部错误。

    res.json({ message: err.message })
}

module.exports = errorHandler