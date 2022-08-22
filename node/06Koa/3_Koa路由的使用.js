const Koa = require('koa')

// koa 没有注册路由的方法 需要下载第三方插件 kao-router
const Router = require('koa-router')

const app = new Koa()

// 注册一个 /users 的路由
const usersRouter = new Router({ prefix: '/users' }) // prefix 是路由前缀

usersRouter.get('/', (ctx, next) => {
  ctx.response.body = {
    msg: '请求成功',
    data: {
      name: 'xyt'
    },
    code: 1
  }
})
usersRouter.post('/', (ctx, next) => {
  ctx.response.body = {
    msg: '新增成功',
    data: {
      name: ''
    },
    code: 1
  }
})

app.use(usersRouter.routes()) // 注册路由中间件


app.listen(8000, () => {
  console.log('kao 初体验')
})