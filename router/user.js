// 这个文件里面写路由，但是不写处理函数
const express = require('express')
// 导入验证表单数据的规则模块
const {reg_login_schema} = require('../scheme/user')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

const router = express.Router()
// 导入路由处理函数模块
const userHandle = require('../router_handle/user')

// 登录路由,不管是登录还是注册我们都要先验证一下表单，这是为了尽量少的访问服务器
router.post('/login',expressJoi(reg_login_schema),userHandle.login)
// 注册路由
router.post('/register',expressJoi(reg_login_schema),userHandle.register)
// 删除路由，注销用户名信息
router.post('/delete',expressJoi(reg_login_schema),userHandle.userDelete)

// 导出时候最好使用module.exports
module.exports = router