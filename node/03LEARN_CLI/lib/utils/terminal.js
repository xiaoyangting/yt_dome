const { rejects } = require('assert')
const { spawn } = require('child_process')
const { resolve } = require('path')
/* 
  执行终端命令相关代码 
  command： 将要运行的命令
    args： Array 字符串参数数组
    具体可以去查看spawn 的用法
*/
const commandSpawn = (command, args, options) => {
  return new Promise((resolve, rejects) => {
    const childProcess = spawn(command, args, options)

    // 捕获标准输出并将其打印到控制台 
    // childProcess.stdout.on('data', function (data) {
      // console.log('标准输出：\n' + data);
    // });

    childProcess.on('close', () => {
      resolve()
    })
  })
}

module.exports = {
  commandSpawn
}