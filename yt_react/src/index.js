import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

// function FunctionInput(props, ref) {
//   return <input type="text" ref={ref} />
// }
// const ForwardFunctionInput = React.forwardRef(FunctionInput)

class ChildClassEle extends React.Component {
  
  static defaultProps = { // 设置默认属性
    name: '肖杨挺'
  }

  componentWillMount() {
    console.log('ChildClassEle: 2. componentWillMount 将要挂载');
  }

  render() {
    console.log('ChildClassEle: 3. render 进行渲染');
    return <div>{ this.props.count }</div>
  }
  componentDidMount() {
    console.log('ChildClassEle: 4. componentDidMount 挂载完成');
  }
  
  // setState 会引起状态的变化, 父组件更新的时候, 会让子组件的属性发生变化
  // 当属性或者状态发生改变的话, 会走此方法来决定是否要渲染更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildClassEle: 5. shouldComponentUpdate 是否要更新');
    return nextState.number % 3 === 0
  }
  componentWillUpdate() {
    console.log('ChildClassEle: 6. componentWillUpdate 将要更新');
  }

  componentWillReqceiveProps() {
    console.log('ChildClassEle: componentWillReqceiveProps 组件接收到新的属性');
  }
  componentWillUnmount() {
    console.log('ChildClassEle: componentWillUnmount 组件将要卸载');
  }
}
function FunctionChild(props) {
  return <div id={ `function_${props.count}` }>{ props.count }</div>
}
class ClassElement extends React.Component {
  constructor(props) {
    super(props)
    // this.inputClassRef = React.createRef()
    this.inputFunctionRef = React.createRef()
    this.state = {
      number: 0,
    }
    console.log('生命周期: 1. constructor');
  }

  setNumber = () => {
    this.setState({number: this.state.number + 1})
  }

  inputClassFocus = () => {
    console.log(this.inputFunctionRef.current);
    this.inputFunctionRef.current.focus()
    // 通过ref 获取类组件 是获取类组件的实例
    // this.inputClassRef.current.inputFocus()
  }

  componentWillMount() {
    console.log('生命周期: 2. componentWillMount 将要挂载');
  }
  // 获取更新之前的dom 快照, (就是在render后调用 对比差异更新dom前调用)
  getSnapshotBeforeUpdate() {
    console.log('getSnapshotBeforeUpdate', document.getElementById('span'))
    return {
      text: document.getElementById('span').textContent
    }
  }
  // setState 会引起状态的变化, 父组件更新的时候, 会让子组件的属性发生变化
  // 当属性或者状态发生改变的话, 会走此方法来决定是否要渲染更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log('生命周期: 5. shouldComponentUpdate 是否要更新');
    return nextState.number % 2 === 0
  }
  componentWillUpdate() {
    console.log('生命周期: 6. componentWillUpdate 将要更新');
  }
  render() {
    console.log('生命周期: 3. render 进行渲染');
    return (
      <h2 id={`id_${this.state.number}`}>
        <span id="span">{this.props.name}</span>
        <div>{this.state.number}</div>
        <button onClick={this.setNumber}>+</button>
        {/* 类组件 */}
        {/* <ClassInput ref={this.inputClassRef} /> */}
        {/* <ForwardFunctionInput ref={this.inputFunctionRef} /> */}
        {this.state.number === 4 ? null : <ChildClassEle count={this.state.number} name="react" />}
        <FunctionChild count={this.state.number} />
      </h2>
    )
  }
  // 注意: 第三个参数是 getSnapshotBeforeUpdate 的返回值
  componentDidUpdate(props, state, SnapshotBefore) {
    console.log('生命周期: 7. componentDidUpdate 更新完成');
    console.log(document.getElementById('span'));
    console.log(SnapshotBefore);
  }
  componentDidMount() {
    console.log('生命周期: 4. componentDidMount 挂载完成');
  }
}

ReactDom.render(<ClassElement name="react" />, document.getElementById('root'))
