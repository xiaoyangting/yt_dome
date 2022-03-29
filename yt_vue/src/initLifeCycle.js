import Watcher from "./observe/watcher";
import { createElementVNode } from "./vnode/index.JS";
import { createTextVNode } from "./vnode/index.JS";

function createElm(vnode) {
  // console.log(vnode);
  let { tag, data, children, text } = vnode
  // 判断 tag(标签名) 是否是字符串, 如果是代表着是dom元素, 如果不是 就是文本内容
  if (typeof tag === 'string') {
    // 这里将正式节点喝虚拟节点对于起来, 后续可以用到
    vnode.el = document.createElement(tag)
    // 循环当前children 来递归创建 dom
    children.forEach(child => {
      // 递归拿到创建的元素 或者 文本内容然后追加到父元素 然后一层一层进 一层一层出
      vnode.el.appendChild(createElm(child))
    });
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

// oldVNode 是老vnode   vnode 是新vnode
function patch(oldVNode, vnode) {
  // console.log(oldVNode);
  // 初始化
  const isRealElement = oldVNode.nodeType
  console.log(isRealElement);
  if (isRealElement) {
    const elm = oldVNode // 获取真实dom
    const parenElm = elm.parentNode // 拿到父元素
    let newElm = createElm(vnode) // 创建真实dom
    parenElm.insertBefore(newElm, elm.nextSibling) // 将当前新的元素插入到 真实元素的下一个元素的前面
    parenElm.removeChild(elm)
    return newElm
  }
}

export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) { // 将 vnode 转换成真是dom
    const vm = this
    const el = vm.$el;

    // patch 既有初始化真实dom功能, 也有更新功能
    vm.$el = patch(el, vnode)
  }

  // 该方法是创建 描述 dom 元素的对象
  Vue.prototype._c = function () {
    // console.log(...arguments);
    return createElementVNode(this, ...arguments)
  }

  // 该方法是把 字符串 和 变量拼接
  Vue.prototype._v = function () {
    // console.log(...arguments);
    return createTextVNode(this, ...arguments)
  }

  // 该方法是获取 变量 转为字符串
  Vue.prototype._s = function (value) {
    if (typeof value !== 'object') return value
    // console.log(value);
    return JSON.stringify(value)
  }

  Vue.prototype._render = function () {
    // 当渲染的时候会去实例中取值, 我们就可以将属性喝视图绑定在一起( with 传入的this, 所以我们现在吧render的this指向 指向vue 就没人绑定 )
    // console.log( this.$options.render.call(this));
    return this.$options.render.call(this) // render 是ast树 转义后生成的方法
  }
}

export function mountComponent(vm, el) {
  vm.$el = el

  // 调用初始化  render 会返回描述dom的代码树型结构, _update 拿到描述dom的结构之后进行喜欢遍历生成真实dom
  const updateComponent = () => {
    // console.log(vm._render());
    vm._update(vm._render())
  }
  const watcher = new Watcher(vm, updateComponent, true)
  // updateComponent()
}
