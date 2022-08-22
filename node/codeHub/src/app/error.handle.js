const { NAME_OR_PASSWORD_IS_REQUIRED, USER_ALREADY_EXISTS, USER_NOT_EXISTS, USER_PASSWORD_IS_NOT_CORRECT, INVALID_TOKEN } = require("../constant/errorType");

function errorHandle(error, ctx) {
  console.log(error.message, '1')
  let state, msg
  switch (error.message) {
    case NAME_OR_PASSWORD_IS_REQUIRED:
      state = 400
      msg = '账号或密码缺失'
      break;
    case USER_ALREADY_EXISTS:
      state = 409
      msg = '用户已存在'
      break;
    case USER_NOT_EXISTS:
      state = 409
      msg = '用户不存在'
      break;
    case USER_PASSWORD_IS_NOT_CORRECT:
      state = 409
      msg = '密码不正确'
      break;
    case INVALID_TOKEN:
      state = 409
      msg = '无效token'
      break;
    default:
      state = 404
      break;
  }

  ctx.response.state = state
  ctx.response.body = msg
}

module.exports = errorHandle