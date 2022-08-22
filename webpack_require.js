/**
 * common.js require 
 * 
 */

//将模块引用的信息存储在一个对象中
//key为路径信息，value为模块内容封装的函数
var __webpack_modules__ = {
  "./src/js/common.js":
    (function (module) {
      console.log(module)
      const mul = (n1, n2) => {
        return n1 * n2
      }
      module.exports = {
        mul
      }
    })
}

//用作缓存的一个对象
var __webpack_module_cache__ = {};

//获取模块内容的函数，moduleId为对象引用的路径
function __webpack_require__(moduleId) {
  //先去缓存对象中查询
  var cachedModule = __webpack_module_cache__[moduleId];
  //如果缓存命中，cachedModule不为undefined，直接返回内容
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  //定义一个含有exports属性的对象，同时缓存起来
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  //去储存模块引用信息的对象中查找
  //第一个参数module为上一步注册的对象
  //其中的exports用来接收模块中module.export语法导出的内容，这也是为什么要创建这么个对象
  //后两个参数在这个简单的例子中，用不上，我们主要理解模块化的原理
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  //返回内容
  return module.exports;
}

//!function(){}()是一个立即执行的一个语法，这也是这个打包程序的入口
!function () {
  //调用__webpack_require__函数，传入引用路径获取模块内容
  const { mul } = __webpack_require__("./src/js/common.js");
  console.log(mul(10, 20));
}();