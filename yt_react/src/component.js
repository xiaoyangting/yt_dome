import { compareTwoVdom, findDOM } from "./react-dom"

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance // 组件的实例
    this.pendingStates = [] // 保存将要更新的队列
    this.callbacks = [] // 保存将要执行的回调函数 ( setState 传入的回调函数 )
  }

  addState(partialState, callback) {
    // 把要更新的 state 保存至队列中
    this.pendingStates.push(partialState)
    // 判断是否是回调函数, 如果是 再放进去
    if (typeof callback === 'function') this.callbacks.push(callback) 
    this.emitUpdate() // 触发更新逻辑
  }

  // 目前来说 不管状态和属性的变化, 都会执行此方法
  emitUpdate() {
    this.updateComponent() // 让组件更新
  }
  
  // 更新
  updateComponent() {
    let { classInstance, pendingStates } = this
    if (pendingStates.length > 0) { // 如果有等待更新的话
      shouldUpdate(classInstance, this.getState())
    }
  }
  
  // 根据老状态, 和pendingState 这个更新队列, 计算新的状态
  getState() {
    let { classInstance, pendingStates, callbacks } = this
    let { state } = classInstance
    pendingStates.forEach(nextState => {
      if (typeof nextState === 'function') {
        nextState = nextState(state)
      }
      state = { ...state, ...nextState } // 合并状态
    })
    pendingStates.length = 0
    // callbacks.forEach(callback => callback(state));
    return state
  }
}

function shouldUpdate(classUnstance, state) {
  classUnstance.state = state
  classUnstance.forceUpdate()
}

export class Component {
  static isReactComponent = {}
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }

/**
 * @param {*} partialState 更新state 的值
 * @param {*} callback 更新state 之后的回调函数
 */
  setState(partialState, callback) {
    this.updater.addState(partialState, callback)
  }

  /**
   * 组件视图更新
   * 1. 获取 老的虚拟DOM React元素
   * 2. 根据最新的属性和状态计算(生成)新的虚拟dom
   *     然后进行比较, 查找差异, 然后把这些差异同步到真实DOM上
   */
  forceUpdate() {
    let oldReactVdom = this.oldReactVdom // 由于在生成虚拟的时候有把老的虚拟dom挂载类的实例上, 所以这里是能拿到的
    // 根据老的虚拟DOM 查找到老的 真实dom
    let oldDOM = findDOM(oldReactVdom)
    let newReactVdom = this.render() // 生成新的虚拟dom
    // 拿到老真实dom的父节点, 进行对子元素的更新
    compareTwoVdom(oldDOM.parentNode, oldReactVdom, newReactVdom) // 比较差异, 把更新同步到真是dom上
    this.oldReactVdom = newReactVdom // 再一次替换老的虚拟dom, 进行下次更新
  }
}