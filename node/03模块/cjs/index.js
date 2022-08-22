// 而 require 是node 实现的函数, 是同步的 可以再任何地方使用, 和 es6的不同点之一
// require 可以不带 js 后缀名, node 会按 js josn 自动获取
// 如果是公共模块的话 会在 node_module 来获取, 逐层向上获取直到全局
const moduleCs = require('./module.js')

console.log(moduleCs);
