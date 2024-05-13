const rateLimit = require('express-rate-limit')
const {logEvents} = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 这个属性指定了时间窗口的持续时间，单位是毫秒。在本例中，时间窗口被设置为 1 分钟，即 60 秒。
    max: 5, // 这个属性指定了在指定时间窗口内允许的最大请求数。在本例中，每个 IP 地址在 1 分钟内最多允许发起 5 个登录请求。
    message: {message: 'Too many login attempts from this IP, please try again after a 60 second pause'},
    // 这个属性指定了在达到请求限制时返回给客户端的消息。在本例中，如果一个 IP 地址在 1 分钟内发送了超过 5 个登录请求，客户端将收到指定的消息。
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // 这个属性指定了是否返回标准的 HTTP 头部信息来表示请求速率限制情况。
    legacyHeaders: false, // 这个属性指定了是否禁用旧版本的 HTTP 头部信息。
})

module.exports = loginLimiter