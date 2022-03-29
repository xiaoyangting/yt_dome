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
  if (type === REACT_TEXT) { // 判断是否是文本类型, 如果是文本类型的话, 就创建文本节点
    dom = document.createTextNode(props.content);
  } else { // 如果是 DOM节点, 就创建真实节点
    dom = document.createElement(type)
  }
  
  if (props) {
    // 根据虚拟DOM 属性, 更新真实DOM属性
    updateProps(dom, {}, props)
    // 循环更新子元素
    if (typeof props.children === 'object' && props.children.type) { // 他是一个对象, 只有一个子元素
      render(props.children, dom)
    } else if (Array.isArray(props.children)) { // 如果是一个数组, 多个子元素
      reconcileChildren(props.children, dom)
    }
  }
  // 让虚拟DOM的dom属性指向它的本身的真实DOM
  vdom.dom = dom
  return dom
}
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

function reconcileChildren(childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    render(childVdom, parentDom)
  }
}

const ReactDom = {
  render
}
export default ReactDom