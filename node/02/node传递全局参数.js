/*
  node 传递参数( 以全局的方式传递 ), process 是node的全局对象之一( 如浏览器端的 document,  global 才和 window 对应 )
  process对象: process 提供了node 进程中的相关信息
      比如 node 运行环境 参数信息等
  
  process 有一个参数为 argv 这个就是接收全局参数的, argv 是个数组  
  如 可以执行程序的时候, 在命令后面加入你的全局参数
      node node传递全局参数.js name=肖杨挺 age=23
*/

// console.log(process.argv)
console.log(global);
