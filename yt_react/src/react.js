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
  // 判断默认参数的长度是否大于 3, 如果大于3的话, 那么就说明有多个 子元素, 如果有多个子元素的情况下, 就把它们转为数组的形式
  // children 可能是一个字符串, 也可能是一个数字, 也可能是个null undefined, 也可能是一个数组 对象
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else if (children) {
    props.children = wrapToVdom(children)
  }
  return {
    type,
    props
  }
}

const React = {
  createElement
}
export default React