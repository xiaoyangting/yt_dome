#! /usr/bin/env node
// 上面这一行的代码, 是告诉程序使用什么环境来去解析本文件
const program = require('commander')

const { helpOption } = require('./lib/core/help')
const  create = require('./lib/core/create')

// 设置版本号
// program.version(require('./package.json').version)
program.version(require('./package.json').version, '-v') // 也可以把大V 改为小V, 两个打开的话 那就是大小写都OK

// 帮助和可选信息
helpOption()
// program.option('-d, --dest <dest>', '创建模板组件, 列如 -d /src/components')

// 创建项目模板指令
create()

// console.log('你好呀 世界');
// console.log('index',__dirname, __filename);
// process.cwd() // 获取当前执行程序的路径 不是当前代码存放的路径
program.parse(process.argv)

// 新版本需要通过 opts 来调用获取 参数
// console.log(program.opts())

/**
 * 
 * 1. 创建帮助和可选信息 
 * 2. 创建项目模板指令
 */