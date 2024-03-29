const Router = require('koa-router')
const { login } = require('../controller/auth.controller')
const { verifyLogin, verifyAuth } = require('../middleware/auth.middleware')

const authRouter = new Router()

authRouter.post('/login', verifyLogin, login)
authRouter.post('/test', verifyAuth, (ctx, next) => {
  ctx.body = '成功'
})

module.exports = authRouter
