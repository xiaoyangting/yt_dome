import { Component } from "./component"
import { REACT_FORWARD_REF_TYPE } from "./constants";
import { wrapToVdom } from "./utils"

/**
 * 创建元素, 每一个react 元素, 都执行此方法来包装虚拟dom
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
    ref = props.ref
    delete props.ref
    key = props.key
    delete props.key
    delete props.__self
    delete props.__source
  }

  // 判断默认参数的长度是否大于 3, 如果大于3的话, 那么就说明有多个 子元素, 如果有多个子元素的情况下, 就把它们转为数组的形式
  // children 可能是一个字符串, 也可能是一个数字, 也可能是个null undefined, 也可能是一个数组 对象
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else {
    props.children = wrapToVdom(children)
  }
  // console.log(type, config, children);
  
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

/**
 * forwardRef 加了新来的$$type 来判断, 在创建真实dom的时候进行了处理
 * @param {*} render 函数组件
 * @returns 
 */
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render // 原来的函数组件
  }
}

/**
 * 传递上下文到后代组件
 * @returns 
 */
function createContext() {
  function Provider(props) {// value 就是转为虚拟dom里面的一个属性,  children 是子元素
    let { value, children } = props
    Provider._value = value
    return children
  }

  // 函数组件 使用
  // Consumer 通过通过调用函数子组件 传入 Provider._value 的值进去, 使子组件获取到 context
  function Consumer({children}) {
    return children(Provider._value )
  }
  return {
    Provider,
    Consumer
  }
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext
}
export default React
// 创建 函数组件的 ref
/**
 * 转发ref, 通过创建新类组件 调用函数组件, 把ref 传入到函数组件中
 * 函数组件是没有ref的 此方法不是react 里面的处理方式
 * @param {*} fn 函数组件
 * @returns 
 */
// function forwardRef(fn) { 
//   return class extends Component {
//     render() {
//       return fn(this.props, this.props.ref)
//     }
//  }
// }