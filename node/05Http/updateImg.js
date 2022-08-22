const http = require('http')
const url = require('url')
const fs = require('fs')
const qs = require('querystring')

const server = http.createServer((req, res) => {
  const {pathname} = url.parse(req.url)
  if (req.method === 'POST', pathname === '/update') {
    // 设置接收参数的 二进制的流
    req.setEncoding('binary')

    console.log('上传图片');
    let body = ''
    let cs = 0
    console.log(req.headers['content-type']);
    // 请求类型
    const contentType = req.headers['content-type'].split('boundary=')[1]

    // 监听数据传来的事件
    req.on('data', (data) => {
      console.log(cs++)  
      body += data
    })

    // 监听流的结束
    req.on('end', () => {
      console.log(body);
      // console.log(contentType);
      // 处理body 去除 boundary
      body = body.split(contentType)[1]
      console.log(body);

      // 1. 获取 类型位置
      const payload = qs.parse(body, '\r\n', ': ')
      const type = payload['Content-Type']

      // 2. 开始在类型的位置上截取
      const typeIndex = body.indexOf(type)
      const typeLength = type.length
      let imageData = body.substring(typeIndex + typeLength)

      // 3. 去除空格
      imageData = imageData.replace(/^\s\s*/, '')

      // 4. 以流的方式写入, 需要注意的是要以二进制的编码格式 写入
      var writerStream = fs.createWriteStream('./cs.jpeg', { encoding: 'binary' })
      
      writerStream.write(imageData)

      writerStream.on('end', (err) => {
        console.log(err, '完成')
      })

       console.log('文件上传成功');
      // console.log(content['Content-Disposition']);
      res.end('上传成功')
     })
    return
  }
  res.end('请求成功')
})

server.listen('8000', () => {
  console.log('启动成功')
})
