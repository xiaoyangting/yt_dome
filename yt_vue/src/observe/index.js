import { isObject } from "../utils";
import { newArrayProto } from "./array";
import Dep from "./dep";
class Observer {
  constructor(data) {
    // 把当前对类 挂载到当前数据的原型链上
    // data.__ob__ = this // 如果直接链上赋值, 会导致死循环
    // 所以我们需要把该属性该为 不可遍历
    Object.defineProperty(data, '__ob__', { // 如果不设置不可枚举的话, 进入死循环 死循环的条件是 一直在循环这个 __ob__
      value: this,
      enumerable: false, // 不可枚举 ( 不可循环 )
    })

    // 判断如果是数组的话 就劫持改变该数组的方法
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto
      // 观测数组
      // this.observeArray(data)
    } else {
      // 开始循环对象属性 劫持对象
      this.walk(data)
    }
  }
  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
  }
  // 在数组里面如果是对象的话, 是需要进行再次监听的
  observeArray(data) {
    // 循环数组 进行观测监听
    data.forEach(item => {
      observe(item)
    })
  }
}

export function defineReactive(data, key, value) {
  // 再一次判断 观测监听
  observe(value)
  // 每个属性的 dep
  var dep = new Dep()
  Object.defineProperty(data, key, {
    get () { // 取值的时候 会执行get
      console.log('get', key);
      console.log(Dep.target);
      // 如果target 有的情况下, 那么就说明 watcher
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newV) { // 赋值时 执行
      console.log('set', key);
      if (newV === value) return
      observe(newV)
      value = newV
      dep.notify()
    }
  })
}
// 对data 继续观测
export function observe(data) {
  // 判断是否有__ob__ 如果有的情况下, 那么久意味着该数据是被观测过的, 就不需要再观测
  if (data.__ob__ instanceof Observer) {
    return
  }
  // 对这个对象进行劫持
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}