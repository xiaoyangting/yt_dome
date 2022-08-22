const Koa = require('koa')

const app = new Koa()

// koa 注册中间件
app.use((ctx, next) => {
  console.log(ctx.response)
  console.log(ctx.request)

  // 返回参数
  ctx.response.body = {
    msg: '请求成功',
    code: 1,
    data: '你好 世界'
  }
  next() // next 进行下个中间件的调用, 如果不调用 next的话 迭代器会卡到这的
})

app.use((ctx, next) => { 
  ctx.response.body = '这是第二个中间件返回的'
})

app.listen(8000, () => {
  console.log('kao 初体验')
})