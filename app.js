const express = require('express')
const app = express()

// 导入处理跨域问题的包
const cors = require('cors')

const joi = require('@hapi/joi')

app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// 做一个中间件，体会模块化的思想
// 因为请求时会经常使用res.send({status: 1,message:err.message})
// 做一个中间件函数来优化代码,如果在路由的时候遇到直接调用就行
// 必须写在路由的前面
app.use((req, res, next) => {
  // 在res上挂载一个函数来处理发送信息
  // 默认是错误信息，status=1
  res.cc = function (err, status = 1) {
    res.send({
      status: status,
      // 判断err是否为一个实例对象
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 导入urlencoded处理这个字符的express内置中间件,放在注册路由之前
app.use(express.urlencoded({ extended: false }))

// 使用 express.json() 中间件解析 JSON 数据
app.use(express.json())

// 配置解析token的中间件，必须在注册路由之前
const expressJWT = require('express-jwt')

// 导入全局配置文件
const config = require('./config.js')

// 注册这个全局中间件
// unless控制那些路由不用进行token验证
app.use(
  expressJWT
    .expressjwt({
      secret: config.jwtSecretKey,
      algorithms: ['HS256']
      //algorithms: ['RS256']
    })
    .unless({ path: [/^\/api\/user\//, /^\/api\/admin\//] })
)

// 导入用户路由模块
const userRouter = require('./router/user')
const adminRouter = require('./router/admin')
const answerRouter = require('./router/answer')
const hotcommentRouter = require('./router/hotcomment')

const { dbConfig } = require('./db')
// 注册模块
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/answer', answerRouter)
app.use('/api/hot', hotcommentRouter)

// 错误级别中间件
// 所有的错误都写在错误中间件里面
app.use(function (err, req, res, next) {
  if (err instanceof joi.ValidationError) {
    // 错误要return出去，不return就会调用两次res.cc，也就是两次res.send，这个不被允许
    return res.cc('表单格式有误:' + err)
    // console.log(err);
  }
  if (err.name === 'UuauthorizedError') {
    return res.cc('身份认证失败')
  }
  res.cc(err)
  // console.log(err);
})

app.listen(80, () => {
  console.log('server running http://127.0.0.1')
})
