// 导入mysql模块
const db = require('../db/index.js')
// 导入对密码加密的模块,第三方模块,这种加密是不会被逆向破解的
// 同一密码多次加密后得到的加密码不一样
// 这是为了防止数据库被盗用户重要信息被泄露
const bcrypt = require('bcryptjs')

// 导入jwt身份验证相关包，这里是生成token的包
const jwt = require('jsonwebtoken')

// 导入全局文件，这里导入的是加密的密钥
const config = require('../config.js')

// 登录
function login(req, res) {
  // 接受客户端传递的用户名和密码，先判断用户名纯不纯在，然后判断密码
  const userInfo = req.body
  console.log(req)
  console.log(userInfo)
  console.log(111)
  // 查询数据库
  const sqlStr = `select * from db_admin where username=?`
  db.query(sqlStr, userInfo.username, function (err, results) {
    // 查询数组长度为0，查询失败
    if (err) {
      return res.cc(err)
    }
    if (results.length === 0) {
      return res.cc('没有该用户')
    }
    // 判断密码是否正确，因为我们数据库里面的密码都是加密过的，所以我们需要brcypt.compareSync()方法来比较用户输入密码和数据库里面的密码，如果一样返回true,失败返回false
    const isTruepassword = bcrypt.compareSync(userInfo.password, results[0].password)
    if (!isTruepassword) {
      return res.cc('密码错误')
    }
    // 登陆成功之后生成token
    // 生成token时将密码去除为了防止被解密
    const user = { ...results[0], password: '', user_pic: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
    res.send({
      status: 0,
      message: '登陆成功',
      token: 'Bearer ' + tokenStr
    })
    // res.cc('登录成功')
  })
}

// 注册
function register(req, res) {
  // 在里面写注册的逻辑
  // // 1  用户名和密码不能为空
  const userInfo = req.body
  // if(!userInfo.username || !userInfo.password){
  //   // 如果发生错误，一定要return出去，不然服务器会崩溃
  //   // 还有就是不能套两层res.send()
  //   return res.send({
  //     status: 1,
  //     message: '请输入合法的用户名'
  //   })
  // }
  // 进行用户名是否重复的判断
  const sqlStr = 'select * from db_admin where username=?'
  db.query(sqlStr, userInfo.username, (err, results) => {
    if (err) {
      // return res.send({
      //   status: 1,
      //   message: err.message
      // })
      return res.cc(err, 1)
    }
    // 发现重名，select查询返回的结果是一个数组
    if (results.length >= 1) {
      // return res.send({
      //   status: 1,
      //   message: '该用户名已被占用，请换一个用户名'
      // })
      return res.cc('该用户名已被占用，请换一个用户名', 1)
    }
    // 没有重名
    // 先对密码进行加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    // 进行数据库的插入
    // set这种写法只能是当这里的属性名和数据库的属性名一样时才可以使用
    const sqlStr2 = 'insert into db_admin set ?'
    db.query(sqlStr2, { username: userInfo.username, password: userInfo.password }, (err, results) => {
      // 数据库运行出错
      if (err) {
        console.log('err:' + err.message)
        // return res.send({
        //   status:1,
        //   message: "数据库运行出错"
        // })
        return res.cc('数据库运行出错', 1)
      }
      // 数据库运行成功，但是没有行数被影响
      if (results.affectedRows !== 1) {
        // return res.send({
        //   status: 1,
        //   message: '注册失败'
        // })
        return res.cc('注册失败', 1)
      }
      // res.send({
      //   status: 0,
      //   message: '注册成功'
      // })
      res.cc('注册成功', 0)
    })
  })
}

// 主页面，需要登陆才可以访问
function home(req, res) {
  res.cc('home', 0)
}

// 注销用户信息
function userDelete(req, res) {
  // 获取用户输入信息
  const userInfo = req.body
  // 判断是否有该用户名的用户，然后在判断密码是否正确
  const sqlStr = 'select * from db_admin where username=?'
  db.query(sqlStr, userInfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    // 执行sql语句成功但是查询结果条数不为一
    if (results.length !== 1) {
      return res.cc('删除失败')
    }
    // 查看密码是否正确
    const isTruepassword = bcrypt.compareSync(userInfo.password, results[0].password)
    if (!isTruepassword) {
      return res.cc('密码错误，删除失败')
    }
    // 通过sql语句将数据库相应的用户的isdelete状态改为1，我们一般不建议直接删除数据库
    // 将数据库的isdelete删除状态修改为1，默认没有删除是0
    const sqlStr2 = 'update db_user set is_deleted=1 where username=?'
    db.query(sqlStr2, userInfo.username, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      // sql语句运行成功但是影响数据库的行数不为1
      if (results.affectedRows !== 1) {
        return res.cc('删除失败')
      }
      res.cc('删除成功')
    })
  })
}

module.exports = {
  register,
  login,
  userDelete,
  home
}
