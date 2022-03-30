import { REACT_TEXT } from "./constants"
import { addEvent } from './events'

/**
 * 把虚拟DOM转成真实DOM 插入到容器中
 * @param {*} vnode 虚拟DOM
 * @param {*} container 容器
 */
function render(vnode, container) {
  let newDom = createDom(vnode)
  container.appendChild(newDom)
}

/**
 * 把虚拟DOM 转化成真实DOM
 * @param {*} createDom 虚拟DOM
 */
function createDom(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (type === REACT_TEXT || !type) { // 判断是否是文本类型, 如果是文本类型的话, 就创建文本节点
    if (props && props.hasOwnProperty('content')) {
      dom = document.createTextNode(props.content);
    } else {
      dom = document.createTextNode(vdom);
    }
    
  } else if (typeof type === 'function') { // 判断是否是函数组件
    // 在是函数组件的情况下, 还有是 类组件 还是 函数组件的情况
    if (type.isReactComponent) { // 如果改属性存在的情况下, 那么就代表着该组件是类组件 ( 因为他通过 React.Component 继承了该属性 )
      return mountClassComponent(vdom)
    } else {
      return mountFunctionComponent(vdom)
    }
  } else { // 如果是 DOM节点, 就创建真实节点
    dom = document.createElement(type)
  }
  
  if (props) {
    // 根据虚拟DOM 属性, 更新真实DOM属性
    updateProps(dom, {}, props)
    // 循环更新子元素
    if (typeof props.children === 'object' && props.children.type) { // 他是一个对象, 只有一个子元素
      render(props.children, dom)
    } else if (Array.isArray(props.children)) { // 如果是一个数组, 多个子元素, 就重复创建 react 元素
      reconcileChildren(props.children, dom)
    }
  }
  // if (typeof vdom === 'object') {
  // 让虚拟DOM的dom属性指向它的本身的真实DOM, 用来之后的类组件 函数组件获取到真是的dom
  vdom.dom = dom
  if (ref) {
    ref.current = dom
  }
  // }
  return dom
}
// 更新DOM的属性
function updateProps(dom, oldProps, newProps) {
  for (const key in newProps) {
    if (Object.hasOwnProperty.call(newProps, key)) {
      if (key === 'children') { continue } // 后续会单独出来 children, 目前先跳过
      if (key === 'style') {
        let styleObj = newProps[key]
        for (const attr in styleObj) {
          dom.style[attr] = styleObj[attr]
        }
      } else if (key.startsWith('on')) {
        // vdom[key.toLocaleLowerCase()] = newProps[key] // 绑定事件
        addEvent(dom, key.toLocaleLowerCase(), newProps[key])
      } else {
        dom[key] = newProps[key]
      }
    }
  }
}

// 渲染函数组件
function mountFunctionComponent(vdom) {
  let { type, props } = vdom
  let renderVdom = type(props) // 调用函数组件, 返回虚拟DOM
  vdom.oldReactVdom = renderVdom // 再挂载的时候把老的虚拟DOM 挂载到类的实例上
  return createDom(renderVdom)
}
// 渲染类组件
function mountClassComponent(vdom) {
  let { type, props, ref } = vdom // 该vdom type 是 类, 不是一个虚拟dom, 如果是类组件的且有ref 的情况下, 把ref 指向类的实例
  let classInstance = new type(props)
  if (ref) {
    ref.current = classInstance
  }
  let renderVdom = classInstance.render() // 这个render 是调用类里面的 render 生成虚拟DOM, 还没到转换成新的虚拟dom
  classInstance.oldReactVdom = vdom.oldReactVdom = renderVdom // 再挂载的时候把老的虚拟DOM 挂载到类的实例上
  return createDom(renderVdom) // 这一步才是转换成真实dom
}

// 循环子节点 渲染
function reconcileChildren(childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    // 喜欢重复调用创建真实DOM元素
    render(childVdom, parentDom)
  }
}

/**
 * 根据虚拟dom 返回真实dom
 * @param {*} vdom 虚拟dom
 */
export function findDOM(vdom) {
  let { type } = vdom
  console.log(vdom);
  let dom;
  if (typeof type === 'function') { // 如果虚拟dom 是组件类型的话
    dom = findDOM(vdom.oldReactVdom) // 递归拿到真实dom
  } else {
    dom = vdom.dom
  }
  return dom
}

/**
 * 比较新旧的虚拟dom 找出差异, 更新到真实dom上
 * @param {*} parentDom 真实dom的父节点
 * @param {*} oldVdom 老虚拟dom
 * @param {*} newVdom 新虚拟dom
 */
export function compareTwoVdom(parentDom, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom) // 获取到老的真实dom
  let newDOM = createDom(newVdom) // 生成新的真实dom

  parentDom.replaceChild(newDOM, oldDOM) // 目前没有做比较差异 直接替换
}

const ReactDom = {
  render
}
export default ReactDom