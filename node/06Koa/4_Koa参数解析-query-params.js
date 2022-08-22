const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()

// 注册一个 /users 的路由
const usersRouter = new Router({ prefix: '/users' }) // prefix 是路由前缀
usersRouter.get('/:id', (ctx, next) => {
  // 以下两个参数 路由提供
  console.log(ctx.request.params); // 获取动态路由
  console.log(ctx.request.query); // 获取url ?后的参数
  ctx.response.body = {
    msg: '请求成功',
    data: {
      name: 'xyt'
    },
    code: 1
  }
})
// usersRouter.post('/', (ctx, next) => {
//   ctx.response.body = {
//     msg: '新增成功',
//     data: {
//       name: ''
//     },
//     code: 1
//   }
// })

app.use(usersRouter.routes())


app.listen(8000, () => {
  console.log('kao 初体验')
})