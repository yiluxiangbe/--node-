// 导入mysql模块
const db = require('../db/index.js')

// 定义获取答题内容列表的函数
// 这个是进行乱序查询，带有限制条数，用于主页面的显示
function getAnswerList(req, res) {
  // 定义查询语句
  const perPage = 5 // 每页显示 10 条记录
  const page = req.query.page || 1 //默认查询第一页
  const offset = (page - 1) * perPage // 计算偏移量
  var total = 0
  const sql2 = 'SELECT * FROM db_answer where is_deleted=1'
  db.query(sql2, (err, results) => {
    if (err) {
      throw err
    }
    total = results.length
  })
  const sq3 = 'SELECT * FROM db_answer where is_deleted ORDER BY RAND() LIMIT ?'
  db.query(sq3, perPage, (err, results) => {
    if (err) {
      throw err
    }
    res.send({
      status: 1,
      message: '查询成功',
      data: results,
      // 当前是第几页
      pageCurrent: page,
      // 显示数据的尺寸
      pageSize: perPage,
      // 数据库中总的数据总量
      total: total
    })
    // console.log(results);
  })
}

// 定义获取答题内容列表的函数
// 这个是进行分组查询，用于后台管理的显示
function getAdminAnswerList(req, res) {
  // 定义查询语句
  const keyword = req.query.keyword
  // console.log('keyword:' + keyword)
  const perPage = 5 // 每页显示 10 条记录
  const page = req.query.page || 1 //默认查询第一页
  const offset = (page - 1) * perPage // 计算偏移量
  var total = 0
  // 如果含有关键字，那么Sql语句就会不一样
  if (keyword) {
    const sql1 = `SELECT * FROM db_answer WHERE is_deleted=1 and question LIKE '%${keyword}%'`
    // 先查询总的条数，在进行分页查询
    db.query(sql1, (err, results) => {
      if (err) {
        throw err
      }
      total = results.length
    })
    const sql2 = `SELECT * FROM db_answer WHERE is_deleted=1 and question LIKE '%${keyword}%' LIMIT ? OFFSET ?`
    db.query(sql2, [perPage, offset], (err, results) => {
      if (err) {
        throw err
      }
      res.send({
        status: 1,
        message: '查询成功',
        data: results,
        // 当前是第几页
        pageCurrent: page,
        // 显示数据的尺寸
        pageSize: perPage,
        // 数据库中总的数据总量
        total: total,
        method: '关键字查询'
      })
    })
  } else {
    const sql3 = 'SELECT * FROM db_answer where is_deleted=1'
    db.query(sql3, (err, results) => {
      if (err) {
        throw err
      }
      total = results.length
    })
    const sq4 = 'SELECT * FROM db_answer where is_deleted=1 LIMIT ? OFFSET ?'
    db.query(sq4, [perPage, offset], (err, results) => {
      if (err) {
        throw err
      }
      res.send({
        status: 1,
        message: '查询成功',
        data: results,
        // 当前是第几页
        pageCurrent: page,
        // 显示数据的尺寸
        pageSize: perPage,
        // 数据库中总的数据总量
        total: total
      })
      // console.log(results);
    })
  }
}

// 定义删除数据的函数
function deleteAnswerList(req, res) {
  // 定义数据库更新语言，这里我们要传递一个id
  const sql = 'update db_answer set is_deleted=0 where id=?'
  const id = req.body.id
  db.query(sql, id, function (err, results) {
    if (err) {
      return res.cc('err:', err.message)
    }
    if (results.affectedRows !== 1) {
      return res.cc('删除失败')
    }
    res.cc('删除成功', 1)
  })
}

// 定义新增数据的函数
function insertAnswerList(req, res) {
  const sql = 'insert into db_answer set ?'
  const data = req.body
  // console.log(data);
  db.query(sql, { question: data.question, key: data.key, score: data.score, options: data.options }, function (err, results) {
    if (err) {
      return res.cc('err:' + err.message)
    }
    if (results.affectedRows !== 1) {
      return res.cc('插入失败')
    }
    res.send({
      status: 1,
      message: '插入成功',
      data: results.data
    })
  })
}

module.exports = {
  getAnswerList,
  deleteAnswerList,
  insertAnswerList,
  getAdminAnswerList
}
