import { compareTwoVdom, findDOM } from "./react-dom"

// 更新队列
export let updateQueue = {
  isBatchingUpdate: false, // 通过此变量来控制是否批量更新, 如果为true 的话, 就代表着批量更新
  updaters: [], // 更新的队列数组
  batchUpdate() { // 批量更新
    for (const updater of updateQueue.updaters) {
      updater.updateComponent()
    }
    updateQueue.updaters.length = 0
    updateQueue.isBatchingUpdate = false
  }
}

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
  emitUpdate(nextProps) {
    this.nextProps = nextProps // 后面属性变的时候 会调用 emitUpdate 传入新的nextProps
    // 如果当前处于批量更新模式, 那么就把 此实例(Updater) 添加到更新 队列中(updateQueue)
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this)
    } else {
      this.updateComponent() // 组件直接更新
    }
  }
  
  // 更新
  updateComponent() {
    let { classInstance, pendingStates, nextProps} = this
    if (pendingStates.length > 0) { // 如果有等待更新的话
      shouldUpdate(classInstance, nextProps, this.getState())
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

function shouldUpdate(classUnstance, nextProps, state) {
  let willUpdate = true // 是否要更新, 默认值是true
  if (classUnstance.shouldComponentUpdate // 判断是否有此方法
    && (!classUnstance.shouldComponentUpdate(nextProps, state))) { // 并且此方法的返回值为 false
      willUpdate = false
  }
  // 如果更新阀为true 且 有更新阀方法, 那么就代表着可以更新, 就调用 组件将要更新的生命周期
  if (willUpdate && classUnstance.shouldComponentUpdate) {
    classUnstance.componentWillUpdate()
  }
  // 不管要不要更新组件, 组件的属性和类都要是最新的
  if (nextProps) classUnstance.props = nextProps
  classUnstance.state = state
  if (willUpdate) classUnstance.forceUpdate()
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
    // 更新完成, 调用 组件更新完成 的 生命周期
    if (this.componentDidUpdate) this.componentDidUpdate(this.props, this.state)
  }
}