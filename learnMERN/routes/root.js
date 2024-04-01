const express = require('express')
const path = require('path')

const router = express.Router()

// 这是一个 Express 路由的 GET 请求处理方法。它使用了正则表达式来匹配路径，包括根路径 '/'，以及类似 /index.html 和 /index 这样的路径。
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(_dirname, '..', 'views', 'index.html'))
})

module.exports = router