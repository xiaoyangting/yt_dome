const  mysql = require('mysql2')
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD } = require('./config')

const connection = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
})

connection.getConnection((err, conn) => {
  if (err) {
    console.log('连接失败', err)
    return
  }
  console.log('连接成功');
})

module.exports = connection.promise()