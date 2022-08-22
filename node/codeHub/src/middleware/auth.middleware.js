const jwt = require('jsonwebtoken');
const { PUBOUT_KEY } = require('../app/config');

const { NAME_OR_PASSWORD_IS_REQUIRED, USER_NOT_EXISTS, USER_PASSWORD_IS_NOT_CORRECT, INVALID_TOKEN } = require("../constant/errorType")
const { getUserByName } = require("../service/user.service");
const { md5password } = require("../utils/password-handle");

// 验证登录参数等中间件
const verifyLogin = async (ctx, next) => {
  const { user, password } = ctx.request.body
  console.log(ctx.request.body);
  // 1. 判断用户 和 密码是否为空
  if (!user || !password) {
    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }
  // 2. 判断用户是否存在
  const result = await getUserByName(user)
  const userData = result[0]
  if (!userData) {
    const error = new Error(USER_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 3. 判断密码是否正确
  const passwordStr = md5password(password)
  if (passwordStr !== userData.password) {
    const error = new Error(USER_PASSWORD_IS_NOT_CORRECT)
    return ctx.app.emit('error', error, ctx)
  }

  ctx.userDate = userData

  next()
}

// 验证是否授权(token)
const verifyAuth = async (ctx, next) => {
  try {
    const token = ctx.header.authorization.replace('Bearer ', '')
    const result = jwt.verify(token, PUBOUT_KEY, {
      algorithms: ['RS256']
    })
    ctx.userData = result
    await next()
  } catch (err) {
    const error = new Error(INVALID_TOKEN)
    ctx.app.emit('error', error, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth
}