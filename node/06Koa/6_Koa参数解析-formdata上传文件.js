const Koa = require('koa')
const Router = require('koa-router')
// koa 没有提供解析 json 和 urlencodeed 数据, 需要下载第三方插件 koa-bodyparser
const multer = require('koa-multer')

const app = new Koa()

// 解析form-data 使用的是 koa-multer
const storage = multer.diskStorage({
  // 设置文件地址的拦截
  destination:  function (req, file, cb) {
    cb(null, './uploads/')
  },
  // 设置文件的拦截
  filename: (req, flie, cb) => {
    console.log(flie);
    const flieType = flie.mimetype.split('/')[1]
    cb(null, `${flie.fieldname}${new Date().getTime()}.${flieType}`);
  }
})
const upload = multer({
  // dest: './uploads/',
  storage
})
const uploadRouter = new Router({ prefix: '/upload' })
// 注入路由中间件
uploadRouter.post('/avatar', upload.single('avatar'), (ctx, next) => {
  // console.log(ctx.req.file) // 文件信息
  ctx.response.body = {
    msg: '上传成功'
  }
})
app.use(uploadRouter.routes())


app.listen(8000, () => {
  console.log('kao 上传文件')
})