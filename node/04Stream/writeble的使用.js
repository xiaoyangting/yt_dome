const fs = require('fs')

const writer = fs.createWriteStream(
  './测试.txt',
  {
    flags: 'a+',
    start: 9
  }
)

writer.write('1')
writer.write('2')
writer.end('3')


writer.on('finish', (err, data) => {
  console.log(err)
  console.log(data)
})
writer.on('finish', function() {
  console.log("写入完成。");
});
writer.on('clone', function() {
  console.log("写入完成。");
});
