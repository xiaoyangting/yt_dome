import { Component } from "./component"
import { wrapToVdom } from "./utils"

/**
 * 创建元素
 * @param {*} type 类型
 * @param {*} config 配置对象
 * @param {*} children 第一个儿子
 * @returns 
 */
function createElement(type, config, children) {
  let props = { ...config }
  let ref; // 是用来获取虚拟dom实例
  let key; // 用来区分同一个父亲的不同儿子
  if (config) {
    // delete props.ref
    ref = props.ref
    key = props.key
    delete props.key
  }
  // 判断默认参数的长度是否大于 3, 如果大于3的话, 那么就说明有多个 子元素, 如果有多个子元素的情况下, 就把它们转为数组的形式
  // children 可能是一个字符串, 也可能是一个数字, 也可能是个null undefined, 也可能是一个数组 对象
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else {
    props.children = wrapToVdom(children)
  }
  return {
    type,
    props,
    ref,
    key
  }
}

// 创建类组件的 ref
function createRef() {
  return {
    current: null
  }
}

// 创建 函数组件的 ref
/**
 * 转发ref, 通过创建新类组件 调用函数组件, 把ref 传入到函数组件中
 * @param {*} fn 函数组件
 * @returns 
 */
function forwardRef(fn) { 
  return class extends Component {
    render() {
      return fn(this.props, this.props.ref)
    }
 }
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef
}
export default React