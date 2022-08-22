const { POST } = require('./app/config')
const app = require("./app")
// require('./app/dataBase      ')

app.listen(POST, () => {
  console.log('服务器开启完成')
})
