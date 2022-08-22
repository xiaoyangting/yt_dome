const crypto = require('crypto')

const md5password = (password) => {
  // 使用MD5
  const md5 = crypto.createHash('md5')
  const result = md5.update(password).digest('hex') // 加密之后转为字符串
  return result
}

module.exports = {
  md5password
}