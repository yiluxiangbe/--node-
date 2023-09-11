const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'competition'
})

// 向外导出这个数据库连接对象
module.exports = db
