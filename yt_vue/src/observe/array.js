// 我们需要重写数组的某些方法( 如 push 改变原数组的方法 )
let oldArrayProto = Array.prototype // 获取原数组类型
export const newArrayProto = Object.create(oldArrayProto) // 创建新的数组原型

let methods = [ // 找到所有的变异方法
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
] // concat slice 都不会改变原数组

methods.forEach((method) => {
  // 重写所有的数组变异方法 ( 劫持 或者 装饰器 )
  newArrayProto[method] = function (...args) {
    console.log('劫持', this);
    // 我需要调用数组的原有方法
    const res = oldArrayProto[method].call(this, ...args);

    var inserted  = null
    // 判断改变数组的值 是否是对象, 如果是对象的情况下, 需要再一次进行对象观测监听
    switch (method) {
      case 'push':
      case 'unshift': // arr.unshift(1,2,3)
        inserted = args
        break;
      case 'splice':  // arr.splice(0,1,{a:1},{a:1})
        inserted = args.slice(2)
        break
    }

    if (inserted) {
      // 对新增内容再次观测监听, 不需要判断, 在observe 会有判断的
      this.__ob__.observeArray(inserted)
    }

    return res
  }
})