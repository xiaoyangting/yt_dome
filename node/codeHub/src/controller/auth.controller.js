const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')
    

class AuthController {
  login = (ctx, next) => {
    const { id, user } = ctx.userDate
    const token = jwt.sign({ id, user }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24, // 过期时间,   
      algorithm: 'RS256', // 加密算法
    })
    ctx.body = { id, user, token }
  }
}

module.exports = new AuthController()
