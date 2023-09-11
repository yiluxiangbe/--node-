// 导入mysql模块
const db = require('../db/index.js')

// 获取热评
function getHotList(req,res){
  // 分页查询
  const page = parseInt(req.query.page) || 1; // 从请求参数中获取页码，默认为第一页
  const limit = 3; // 每页显示的记录数
  // 计算跳过的记录数
  const offset = (page - 1) * limit;
  const sql2 = `SELECT * FROM db_hot LIMIT ?, ?`// 使用 db.query 进行查询
  db.query(sql2,[offset,limit],function(err,results){
    if(err){
      return res.cc('err:'+err.message)
    }
    // 没有查询到相关数据
    if(results.length === 0){
      return res.cc('获取失败')
    }
    res.send({
      status: 1,
      message: '获取成功',
      data: results
    })
  })
}

// 新增热评
function insertHotList(req,res){
  const data = req.body
  //先判断是否有重复
  const sql1 = 'select * from db_hot where url=?'
  db.query(sql1,data.url,function(err,results){
    if(err){
      return res.cc('err:'+err.message)
    }
    if(results.length !== 0){
      return res.cc('有重复热评')
    }
    // 进行插入操作
    const sql2 = 'insert into db_hot set ?'
    db.query(sql2,{keyword: data.keyword,url: data.url},function(err,results){
      if(err){
        return res.cc('err:'+err.message)
      }
      if(results.affectedRows !== 1){
        return res.cc('插入失败')
      }
      res.cc('新增成功',1)
    })
  })
}

// 删除热评
// 根据id来删除
function deleteHotList(req,res){
  const id = req.body.id
  const sql = 'update db_hot set is_deleted=0 where id=?'
  db.query(sql,id,function(err,results){
    if(err){
      return res.cc('err:'+err.message)
    }
    if(results.affectedRows !== 1){
      return res.cc('删除失败')
    }
    res.cc('删除成功',1)
  })
}
module.exports = {
  getHotList,
  insertHotList,
  deleteHotList
}