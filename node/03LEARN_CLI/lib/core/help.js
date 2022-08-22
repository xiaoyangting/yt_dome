const program = require('commander')
const helpOption = () => {
  program
    // 设置 option 
    .option('--test', '这是测试描述')
    // 整个命令是可选的, 但是如果加上可选参数, 那么就意味着该命令 后面的参数 是必填参数了
    .option('-d --dest <dest>', '创建组件, 列如 -d /src/components')
  // .action((str, options) => { // 这是监听整体的配置
  //   console.log(str.test);
  //   console.log(options);
  // });

  // 监听 --help 但是好像不能监听其他的
  program.on('--help', function () {
    console.log('查看帮助文档');
  })
}

module.exports = {
  helpOption
}