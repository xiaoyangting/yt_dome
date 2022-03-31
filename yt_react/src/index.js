import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

function FunctionInput(props, ref) {
  return <input type="text" ref={ref} />
}
const ForwardFunctionInput = React.forwardRef(FunctionInput)
class ClassElement extends React.Component {
  static defaultProps = { // 设置默认属性
    name: '肖杨挺'
  }
  
  constructor(props) {
    super(props)
    // this.inputClassRef = React.createRef()
    this.inputFunctionRef = React.createRef()
    this.state = {
      number: 0
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
      <h2 className='H2'>
        <span>{this.props.name}</span>
        <div>{this.state.number}</div>
        <button onClick={this.setNumber}>+</button>
        {/* 类组件 */}
        {/* <ClassInput ref={this.inputClassRef} /> */}
        <ForwardFunctionInput ref={this.inputFunctionRef} />
        <button onClick={this.inputClassFocus}>聚焦处理</button>
      </h2>
    )
  }
  componentDidUpdate() {
    console.log('生命周期: 7. componentDidUpdate 更新完成');
  }
  componentDidMount() {
    console.log('生命周期: 4. componentDidMount 挂载完成');
  }
}

ReactDom.render(<ClassElement name="react" />, document.getElementById('root'))
