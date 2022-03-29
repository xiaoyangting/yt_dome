/**
 * dep是每个属性都会有一个, 
 * watcher 是没个组件都会有一个, 所以就会是一个多对多形式, 因为该组价的属性, 也有可能用到别的组件
 * 1. 当我们创建渲染 watcher 的时候, 我们会把当前的渲染watcher 放到 Dep.target 上 ( 为了互相记录, 也就是watcher需要记录dep dep也需要记录watcher)
 * 2. 调用_render() 的时候, 里面的_s 会调用属性, 走到属性监听的 get 上
 * 每个属性都会有一个 dep ( 属性就是被观察者 ),  watcher 就是观察者 ( 属性变化了会通知观察者来个小 ) = 观察者模式
 */

import Dep from "./dep"

// 不同组件有不同的 watcher
let id = 0
class Watcher {
  constructor(vm, fn, options) {
    this.renderWatcher = options // 目前没用到
    this.getter = fn // getter 意味着调用 _update(vm._render) 这个函数, 可以获取变量, 产生取值(也就是get)操作
    this.id = id++ // watcher 的唯一标识
    this.dep = [] // 用来存储dep ( 后续作用的话 是实现计算属性, 和一些清理工作, 具体慢慢来 目前我也不知道 )
    this.depId = new Set() // 用来去重dep的
    this.get()
  }
  get() {
    Dep.target = this
    this.getter()
    Dep.target = null 
  }
  addDep(dep) {
    const  id = dep.id 
    if (!this.depId.has(id)) { // Set 有一个 has( 判断是否有该属性 如果有返回 true, 没有则是 false)
      this.depId.add(id)
      this.dep.push(dep) // 记录 dep( 也就是属性 )
      dep.addSub(this) // 通过传过来的 dep(实例对象) 调用里面的原型方法, 让当前dep 存储记录 当前 watcher
    }
  }

  // 收集更新 ( vue里面的dom 更新是异步更新   )
  update(watcher) { // 该 watcher 是从dep里面传来的, 而dep里面的 watcher 在之前记录属性的时候, 就已经做了交叉存储
    queueWatch(watcher)
  }

  // 更新
  run() {
    this.get()
  }
}

let queue = [] // 监听队列
let has = {} // 做列表维护, 判断存放了哪些watcher,  去重, 为的是同个 watch 下, 不多次更新DOM, 只待留一次 进行一次性更新
let pending = false // 防抖

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0) // 获取存储的所有 watcher 队列
  queue = []
  has = {}
  pending = false
  // 循环 watcher 队列, 执行每个 watcher 里面的更新操作(run) 也就是更新
  flushQueue.forEach(w => w.run())
}

// 记录watcher 进行批处理
function queueWatch(watcher) {
  // 首先拿到id 处理节流阀
  const id = watcher.id
  // 在has 里面没有该watch 的情况下 才进行存储 watch
  if (!has[id]) {
    queue.push(watcher) // 追加当前watcher 下, 利用宏任务微任务的特性, 在代码执行完成之后再更新( 也就是等data 里面的属性全部更改完成之后 再统一更新, 而不是更改一个属性 就更新一次dom )
    has[id] = true
    // 不管我们的update 执行多少次, 但最终只执行一轮更新dom 操作
    if (!pending) {
      nextTick(flushSchedulerQueue)
    }
  }
}

// 这个批处理, 是为了不让用户 为了拿到 vue 更改之后的dom元素 而不乱开定时器, 进行的批处理
let callbacks = [] // 异步更新队列, 用户如果调用的话, 谁先调用 谁的快
let waiting = false // nextTickk 的节流阀
function flushCallbacks () {
  callbacks.forEach(cb => cb())
}
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}

export default Watcher