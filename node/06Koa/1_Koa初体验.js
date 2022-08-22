const Koa = require('koa')


const app = new Koa()

// koa 注册中间件
app.use((ctx, next) => {
  console.log(ctx.response)
  console.log(ctx.request)
  // 返回参数
  // ctx.response.body = '你好 世界'
  ctx.response.body = {
    msg: '请求成功',
    code: 1,
    data: '你好 世界'
  }
})

app.listen(8000, () => {
  console.log('kao 初体验')
})