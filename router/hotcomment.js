// 这个文件里面写路由，但是不写处理函数
const express = require('express')
// 导入验证表单数据的规则模块
const {reg_hot_schema} = require('../scheme/hotcomment')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

const router = express.Router()
// 导入路由处理函数模块
const hotHandle = require('../router_handle/hotcomment')

// 获取热评列表
router.get('/get',hotHandle.getHotList)
// 新增热评
router.post('/insert',expressJoi(reg_hot_schema),hotHandle.insertHotList)
// 删除热评
router.post('/delete',expressJoi(reg_hot_schema),hotHandle.deleteHotList)

// 导出时候最好使用module.exports
module.exports = router