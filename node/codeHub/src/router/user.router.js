const Router = require('koa-router')
const { UserControllerCreate, handlePassword } = require('../controller/user.controller')
const { verifyUser } = require('../middleware/user.middleware')
const userRouter = new Router({ prefix: '/user' })

userRouter.post('/', verifyUser, handlePassword, UserControllerCreate)


module.exports = userRouter