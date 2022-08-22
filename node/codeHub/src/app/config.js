const fs = require('fs')
const path = require('path')

const dotenv = require('dotenv')

dotenv.config({ path: '.env' })

let PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key')) // 私钥
let PUBOUT_KEY = fs.readFileSync(path.resolve(__dirname, './keys/pubout.key')) // 公钥

module.exports = {
  POST,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,  
} = process.env

module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBOUT_KEY = PUBOUT_KEY