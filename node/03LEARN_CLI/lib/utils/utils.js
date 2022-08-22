const path = require('path')
const fs = require('fs')

const ejs = require('ejs')

// 编译模板
const compile = (templateName, data) => {
  // 拼接模板地址
  const templatePath = path.resolve( __dirname, `../template/vue/${templateName}`)
  return new Promise((resolve, rejects) => {
    ejs.renderFile(templatePath, data, {}, (err, res) => {
      if (err) {
        rejects(err)
        return
      }
      resolve(res)
    })
  })
}

// 写入文件
const writeToFile = (path, content) => {
  return fs.promises.writeFile(path, content)
}

module.exports = {
  compile,
  writeToFile
}