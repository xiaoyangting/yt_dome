const Koa = require('koa')
const Router = require('koa-router')
// koa 没有提供解析 json 和 urlencodeed 数据, 需要下载第三方插件 koa-bodyparser
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer')


const app = new Koa()

// 解析 json 和 urlencodeed 都是使用 bodyparser
app.use(bodyParser())
// 注册一个 /users 的路由
const usersRouter = new Router({ prefix: '/users' })
usersRouter.post('/', (ctx, next) => {
  console.log(ctx.request.body); // 解析的 json 数据就被放在了 ctx.request.body 里面
  ctx.response.body = {
    msg: '新增成功',
    data: {
      name: ''
    },
    code: 1
  }
})


// 解析form-data 使用的是 koa-multer
const upload = multer()
const uploadRouter = new Router({ prefix: '/upload' })
// 注入路由中间件
uploadRouter.use(upload.any())
uploadRouter.post('/avatar', (ctx, next) => {
  console.log(ctx.req.body) // multer 的参数是 req 而不是 request
  ctx.response.body = {
    msg: '上传成功'
  }
})
app.use(usersRouter.routes())
app.use(uploadRouter.routes())


app.listen(8000, () => {
  console.log('kao 初体验')
})