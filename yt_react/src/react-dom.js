import { REACT_TEXT } from "./constants"

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
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT || !type) { // 判断是否是文本类型, 如果是文本类型的话, 就创建文本节点
    if (props && props.content) {
      dom = document.createTextNode(props.content);
    } else {
      dom = document.createTextNode(vdom);
    }
    
  } else if (typeof type === 'function') { // 判断是否是函数组件
      return mountFunctionComponent(vdom)
  } else { // 如果是 DOM节点, 就创建真实节点
    console.log(type, props);
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
    } else { // 在不是对象 不是 数组的情况下 将文本加入dom
      render(props.children, dom)
    }
  }
  // 让虚拟DOM的dom属性指向它的本身的真实DOM
  // if (typeof vdom === 'object') {
  //   vdom.dom = dom
  // }
  return dom
}
// 更新DOM的属性
function updateProps(vdom, oldProps, newProps) {
  for (const key in newProps) {
    if (Object.hasOwnProperty.call(newProps, key)) {
      if (key === 'children') { continue } // 后续会单独出来 children, 目前先跳过
      if (key === 'style') {
        let styleObj = newProps[key]
        for (const attr in styleObj) {
          vdom.style[attr] = styleObj[attr]
        }
      } else {
        vdom[key] = newProps[key]
      }
    }
  }
}

function mountFunctionComponent(vdom) {
  let { type, props } = vdom
  let renderVdom = type(props) // 调用函数组件, 返回虚拟DOM
  console.log(renderVdom);
  return createDom(renderVdom)
}

function reconcileChildren(childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    // 喜欢重复调用创建真实DOM元素
    render(childVdom, parentDom)
  }
}

const ReactDom = {
  render
}
export default ReactDom