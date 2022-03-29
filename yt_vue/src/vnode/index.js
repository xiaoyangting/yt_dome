export function createElementVNode(vm, tag, data, ...children) {
  if (data == null) {
    data = {}
  }
  let key = data.key
  if (key) {
    delete data.Key
  }
  return vnode(vm, tag, key, data, children)
}

// _v() 使用到
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// 这个 vnode 和 ast 一样吗?  ast做的是语法层面的转换, 它描述的是语法本身( 可以描述js css  html )
// 我们的虚拟dom 是描述dom元素, 可以增加一些自定义属性 ( 描述 dom )
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}