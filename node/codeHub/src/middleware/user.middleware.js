const { NAME_OR_PASSWORD_IS_REQUIRED, USER_ALREADY_EXISTS } = require("../constant/errorType")
const { getUserByName } = require("../service/user.service")

async function verifyUser(ctx, next) {
  const { user, password } = ctx.request.body
  // 判断用户账号 密码是否为空
  if (!user || !password) {
    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 查询用户是否存在
  const result = await getUserByName(user)
  if (result.length) {
    const error = new Error(USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }
  await next()
}

module.exports = {
  verifyUser
}