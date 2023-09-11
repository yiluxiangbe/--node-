// 这个文件里面写路由，但是不写处理函数
const express = require('express')

const router = express.Router()
// 导入路由处理函数模块
const answerHandle = require('../router_handle/answer')
// 导入表单验证
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入验证表单数据的规则模块
const { insert_answer_schema } = require('../scheme/answer')

// 获取答题数据列表，第一个是乱序获取，带有限制条数
router.get('/get', answerHandle.getAnswerList)
// 获取答题数据列表，第二个是分页获取，关系系统进行查看
router.get('/getAdmin', answerHandle.getAdminAnswerList)
// 删除答题数据
router.post('/delete', answerHandle.deleteAnswerList)
// 新增答题数据
router.post('/insert', expressJoi(insert_answer_schema), answerHandle.insertAnswerList)

// 导出时候最好使用module.exports
module.exports = router
