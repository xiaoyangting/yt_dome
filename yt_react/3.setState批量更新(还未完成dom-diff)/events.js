import { updateQueue } from './component'

/**
 * 实现事件委托, 把所有的事件都绑定到 document 上
 * @param {*} dom 真实dom
 * @param {*} eventType 事件类型
 * @param {*} handler 事件函数
 */
export function addEvent(dom, eventType, handler) {
  let store; // 对象, 里面存放着此 dom 上对应的事件处理函数
  // 判断dom 上是否有该属性, 如果没则 赋值一个空对象
  if (dom.store) {
    store = dom.store
  } else {
    dom.store = {}
    store = dom.store
  }

  store[eventType] = handler // 把当前事件 加入到store上
  if (!document[eventType]) {
    document[eventType]  = dispatchEvent
  }
}

// document 的 事件程序
function dispatchEvent(event) {
  debugger
  let { target, type } = event // 获取到事件源 与 事件类型
  let eventType = `on${type}`
  updateQueue.isBatchingUpdate = true // 把 setState 事件队列切换为批量更新模式
  let syntheticEvent = createSyntheticEvent(event) // 合成事件
  
  while (target) { // 判断是否与target, 模拟事件冒泡的过程
    let { store } = target
    let handler = store && store[eventType] // 获取到事件函数
    handler && handler.call(target, syntheticEvent); // 开始执行事件函数
    target = target.parentNode
  }
  updateQueue.isBatchingUpdate = false // 把  setState 事件队列切换为直接更新模式
  updateQueue.batchUpdate() // 调用批量更新
}

// 合成事件, 在源码里面 此处做了一些浏览器兼容性的适配
function createSyntheticEvent(event) {
  let syntheticEvent = {}
  for (const key in event) {
    syntheticEvent[key] = event
  }
  return syntheticEvent
}