const { userServiceCeate } = require("../service/user.service")
const { md5password } = require("../utils/password-handle")

class UserController {
  async UserControllerCreate(ctx, next) {
    // ctx.body = '访问完成'
    ctx.body = await userServiceCeate(ctx.request.body)
  }

  // 加密 密码
  async handlePassword(ctx, next) {
    const { password } = ctx.request.body
    ctx.request.body.password = md5password(password)
   await next()
  }
}

module.exports = new UserController()