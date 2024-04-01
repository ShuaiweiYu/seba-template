const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
// date-fns：用于格式化日期和时间。
// uuid：用于生成唯一标识符。
// fs：Node.js 中的文件系统模块，用于文件操作。
// fs.promises：Node.js 中的 Promise 风格的文件系统模块，用于异步文件操作。
// path：Node.js 中的路径处理模块，用于处理文件路径。

// 用于记录日志事件到文件中。它接受两个参数：message 是要记录的日志消息，logFileName 是日志文件的名称。
const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    // 使用 date-fns 格式化当前时间，并结合 uuid 生成唯一标识符，构造了日志条目 logItem

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            // 使用 fs.existsSync 检查日志文件夹是否存在，如果不存在则使用 fsPromises.mkdir 异步创建文件夹。
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
        //使用 fsPromises.appendFile 异步将日志条目追加到指定的日志文件中。
    } catch (err) {
        console.log(err)
    }
}

// 定义 logger 中间件函数：这是一个 Express.js 中间件函数，用于在每次请求到达时记录请求信息到日志文件中。
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    // 调用 logEvents 函数记录请求方法、URL 和请求来源到名为 'reqLog.log' 的日志文件中。
    console.log(`${req.method} ${req.path}`)
    // 使用 console.log 打印请求方法和路径到控制台。
    next()
    // 调用 next() 函数，将请求传递给下一个中间件函数。
}

module.exports = { logEvents, logger }