import { REACT_TEXT, REACT_FORWARD_REF_TYPE, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO } from "./constants"
import { addEvent } from './events'

/**
 * 把虚拟DOM转成真实DOM 插入到容器中
 * @param {*} vnode 虚拟DOM
 * @param {*} container 容器
 */
function render(vnode, container) {
  let newDom = createDom(vnode)
  container.appendChild(newDom)
  newDom.componentDidMount && newDom.componentDidMount() // 目前挂载完成生命周期, 先放在这个地方
}

/**
 * 把虚拟DOM 转化成真实DOM
 * @param {*} createDom 虚拟DOM
 */
function createDom(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  
  // 如果type.$$typeof 属性是 REACT_MEMO 值, 说明它是一个 memo 类型
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom)

    // 如果type.$$typeof 属性是 REACT_PROVIDER 值, 说明它是一个 createContext 类型
  }else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom)

    // 如果type.$$typeof 属性是 REACT_CONTEXT 值, 说明它是一个 forwardRef 类型
  }else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom)

    // 如果type.$$typeof 属性是 REACT_FORWARD_REF_TYPE 值, 说明它是一个 forwardRef 类型
  } else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return mountForwardComponent(vdom)
  } else if (type === REACT_TEXT || !type) { // 判断是否是文本类型, 如果是文本类型的话, 就创建文本节点
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
  let defaultProps = type.defaultProps || {} // 获取类里面的 默认props
  let classInstance = new type({ ...defaultProps, ...props }) // 合并默认props 和 传入的props
  // 判断是否有 contextType, 如果有的话就说明有上下文传递, 那么就把当前存储在 contextType 的 _value 赋值给 当前实例的 context
  if (type.contextType) {
    classInstance.context = type.contextType._currentValue
  }
  vdom.classInstance = classInstance // 把实例挂载到 dom 里面
  if (ref) ref.current = classInstance
  classInstance.componentWillMount && classInstance.componentWillMount() // 类组件的生命周期, 组件将要挂载
  let renderVdom = classInstance.render() // 这个render 是调用类里面的 render 生成虚拟DOM, 还没到转换成新的虚拟dom
  classInstance.oldReactVdom = vdom.oldReactVdom = renderVdom // 再挂载的时候把老的虚拟DOM 挂载到类的实例上
  let dom = createDom(renderVdom) // 这一步才是转换成真实dom
  if (classInstance.componentDidMount)
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance) // 类组件的生命周期, 组件挂载完成, 载到dom里面, 渲染完成之后再次调用
  return dom
}
// 渲染 forwardRef 组件
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom // 此时的type 是函数组件
  let renderVdom = type.render(props, ref)
  vdom.oldReactVdom = renderVdom
  return createDom(renderVdom)
}
// 渲染 context.Provider 组件( 传递上下文 )
function mountProviderComponent(vdom) {
  console.log('mountProviderComponent', vdom);
  let { type, props } = vdom
  // 在渲染 provider 组件的时候, 拿到属性中的 value, 赋值给 context._currentValue
  type._context._currentValue = props.value
  let renderVdom = props.children // children 是虚拟dom 
  vdom.oldReactVdom = renderVdom
  return createDom(renderVdom)
}
// 渲染 context.Consumer 组件( 传递上下文 )
function mountContextComponent(vdom) {
  console.log('mountContextComponent', vdom);
  let { type, props } = vdom
  let renderVdom = props.children(type._context._currentValue)
  vdom.oldReactVdom = renderVdom
  return createDom(renderVdom)
}
// 渲染 memo 组件 
function mountMemoComponent(vdom) {
  let { type, props } = vdom
  let renderVdom = type.type(props)
  vdom.prevProps = props // 记录老的 属性对象, 在更新的时候进行对比 来 决定是否需要更新组件
  vdom.oldReactVdom = renderVdom
  return createDom(renderVdom)
}


// 循环子节点数组 渲染
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
  let dom;
  if (typeof type === 'string' || type === REACT_TEXT) { // 原生组件
    dom = vdom.dom
  } else { // 可能是函数组件 类组件 provider context forward 
    dom = findDOM(vdom.oldReactVdom) // 递归拿到真实dom
  }
  return dom
}

/**
 * 比较新旧的虚拟dom 找出差异, 更新到真实dom上
 * @param {*} parentDom 真实dom的父节点
 * @param {*} oldVdom 老虚拟dom
 * @param {*} newVdom 新虚拟dom
 */
export function compareTwoVdom(parentDom, oldVdom, newVdom, nextDOM) {
  // console.log(oldVdom);
  if (!oldVdom && !newVdom) { // 如果老的虚拟dom 为null, 新的虚拟dom 也为null, 那么就什么都不需要做

  } else if (oldVdom && !newVdom) { // 如果老的虚拟dom有值, 新的没有, 那就意味着老的虚拟dom要被销毁
    let currentDOM = findDOM(oldVdom) // 获取到真实DOM 销毁掉
    currentDOM.parentNode.removeChild(currentDOM)
    // 判断老的虚拟dom 上是否有类实例, 并且判断是否有销毁组件的生命周期, 且执行它
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount()
    }

  } else if (!oldVdom && newVdom) { // 老的没有, 新的有, 创建真实dom
    let newDom = createDom(newVdom) // 创建真实dom 添加到 父元素中
    
    // 判断后面是否有其他节点, 如果有则插入, 否则追加到最后
    if (nextDOM) {
      parentDom.insertBefore(newDom, nextDOM);
    } else {
      parentDom.appendChild(newDom)
    }
    newDom.componentDidMount && newDom.componentDidMount() // 目前挂载完成生命周期, 先放在这个地方

  } else if (oldVdom && newVdom && (oldVdom.type !== newVdom.type)) { // 新老都有, 但是type 不一样( div p ), 不能复用, 删除老的 添加新的
    let oldDOM = findDOM(oldVdom) // 获取老的 真实dom
    let newDom = createDom(newVdom) // 创建新的 真实dom
    oldDOM.parentNode.replaceChild(newDom, oldDOM) // 替换掉
    newDom.componentDidMount && newDom.componentDidMount() // 目前挂载完成生命周期, 先放在这个地方

  } else { // 新老都有, type 也一样, 那就需要复用老节点, 进行深度递归 一层一层比较
    updateElement(oldVdom, newVdom)
  }
}

/**
 * 走到此函数 说明 新老虚拟dom都有 并且type是一样的, 是需要复用dom
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(oldVdom, newVdom) {
   // REACT_MEMO memo 更新
   if (oldVdom.type  && oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom)
    // REACT_PROVIDER context.Provider 更新
  }else if (oldVdom.type  && oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom)

  // REACT_PROVIDER context.Consumer 更新
  } else if (oldVdom.type  && oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom)

  // oldVdom.type 有 类组件 函数组价 原生组件 文本类型
  }else if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT ) {
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    // 判断文本节点是否一致, 如果不一致的话再进行更新
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content
    }

   } else if (typeof oldVdom.type === 'string') { // 说明是原生组件 div 等
    // 让新的虚拟dom的真实DOM属性等于 老的虚拟dom对应的那个真实DOM
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    // 用新的属性 更新DOM的老属性
    updateProps(currentDOM, oldVdom.props, newVdom.props)
    // 更新子节点
    updateChild(currentDOM, oldVdom.props.children, newVdom.props.children)

    // 如果type 为 函数类型
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) { // 判断是否是类组件
      updateClassComponent(oldVdom, newVdom) // 更新类组件
    } else {
      updateFunctionComponent(oldVdom, newVdom)
    }
  }
}

/**
 * 类组件的更新
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = newVdom.classInstance = oldVdom.classInstance
  // 因为此更新是由于父组件更新引起的, 父组件在重新渲染的时候, 给子组件传递新的属性
  if (classInstance.componentWillReqceiveProps) {
    classInstance.componentWillReqceiveProps() // 执行 props 更新的生命周期
  }
  classInstance.updater.emitUpdate(newVdom.props)
  newVdom.oldReactVdom = oldVdom.oldReactVdom
}

/**
 * 函数组件更新
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode
  let { type, props } = newVdom
  let renderVdom = type(props) // 执行函数 返回新的虚拟dom
  // 进行递归比较
  compareTwoVdom(parentDOM, oldVdom.oldReactVdom, renderVdom)
  newVdom.oldReactVdom = renderVdom
}

// REACT_PROVIDER context.Provider 更新  提供商
function updateProviderComponent(oldVdom, newVdom) {
  console.log('updateProviderComponent');
  let parentDOM = findDOM(oldVdom).parentNode
  let { type, props } = newVdom
  type._context._currentValue = props.value // 覆盖 context 的value
  let renderVdom = props.children
  // 进行递归比较
  compareTwoVdom(parentDOM, oldVdom.oldReactVdom, renderVdom)
  newVdom.oldReactVdom = renderVdom
}

// REACT_PROVIDER context.Consumer 更新  消费者
function updateContextComponent(oldVdom, newVdom) {
  console.log('updateProviderComponent');
  let parentDOM = findDOM(oldVdom).parentNode
  let { type, props } = newVdom
  let renderVdom = props.children(type._context._currentValue) // 执行函数 返回新的虚拟dom
  // 进行递归比较
  compareTwoVdom(parentDOM, oldVdom.oldReactVdom, renderVdom)
  newVdom.oldReactVdom = renderVdom
}

// REACT_MEMO memo 更新 比较props 是否需要更新
function updateMemoComponent(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom
  // 判断是否需要更新组件, 如果不需要的话, 在新的 Vdom 上更新属性 状态等
  if (type.compare(prevProps, newVdom.props)) {
    newVdom.oldReactVdom = oldVdom.oldReactVdom
    newVdom.prevProps = prevProps 
  } else {
    // 如果需要更新的组件的情况下, 就更新组件并且更新 属性 与 状态
    let parentDOM = findDOM(oldVdom).parentNode
    let { type, props } = newVdom
    let renderVdom = type.type(props)
    compareTwoVdom(parentDOM, oldVdom.oldReactVdom, renderVdom)
    newVdom.oldReactVdom = renderVdom
    newVdom.prevProps = props // 记录老的 属性对象, 在更新的时候进行对比 来 决定是否需要更新组件
    // 进行递归比较
  }
}


/**
 * 更新子节点
 * @param {*} currentDOM 
 * @param {*} oldVChildre 
 * @param {*} newVChildren 
 */
function updateChild(currentDOM, oldVChildre, newVChildren) {
  // 由于childre 可能是数组 可能对象 可能是 null, 所以判断转为数组
  oldVChildre = Array.isArray(oldVChildre) ? oldVChildre : [oldVChildre]
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  let maxLength = Math.max(oldVChildre.length, newVChildren.length)

  for (let i = 0; i < maxLength; i++) {
    // 找当前的虚拟DOM节点 之后的最近的一个真是DOM节点
    let nextVNdom = oldVChildre.find((item, index) => {
      return index > i && item && findDOM(item)
    })
    compareTwoVdom(currentDOM, oldVChildre[i], newVChildren[i], nextVNdom && findDOM(nextVNdom))
  }
}

const ReactDom = {
  render
}
export default ReactDom

// /**
//  * 比较新旧的虚拟dom 找出差异, 更新到真实dom上
//  * @param {*} parentDom 真实dom的父节点
//  * @param {*} oldVdom 老虚拟dom
//  * @param {*} newVdom 新虚拟dom
//  */
// export function compareTwoVdom(parentDom, oldVdom, newVdom) {
//   let oldDOM = findDOM(oldVdom) // 获取到老的真实dom
//   let newDOM = createDom(newVdom) // 生成新的真实dom

//   parentDom.replaceChild(newDOM, oldDOM) // 目前没有做比较差异 直接替换
// }
