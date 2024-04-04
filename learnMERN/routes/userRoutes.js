const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    // 使用 router.route('/') 定义了针对 / 路径的路由。这意味着该路由将匹配任何发送到根路径的请求。
    .get(usersController.getAllUsers)
    // 在该路由上定义了一个 GET 请求处理程序，使用 usersController.getAllUsers 方法来处理该请求。这意味着当收到 GET 请求时，将调用 usersController.getAllUsers 方法来处理该请求。
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router