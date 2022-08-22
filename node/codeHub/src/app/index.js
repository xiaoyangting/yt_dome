const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const authRouter = require('../router/auth.router');
const userRouter = require('../router/user.router');
const errorHandle = require('./error.handle');
const app = new Koa()

app.use(bodyParser())
// 注入中间件路由
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.use(authRouter.routes())

app.on('error', errorHandle)

module.exports = app;    