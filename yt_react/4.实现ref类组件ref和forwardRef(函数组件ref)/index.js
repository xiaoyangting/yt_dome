import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

// 类组件的ref
// class ClassInput extends React.Component {
//   constructor() {
//     super()
//     this.inputRef = React.createRef()
//   }

//   inputFocus = () => {
//     this.inputRef.current.focus()
//   }

//   render() {
//     return <input type="text" ref={this.inputRef} />
//   }
// }

function FunctionInput(props, ref) {
  return <input type="text" ref={ref} />
}
const ForwardFunctionInput = React.forwardRef(FunctionInput)
class ClassElement extends React.Component {
  
  constructor(props) {
    super(props)
    // this.inputClassRef = React.createRef()
    this.inputFunctionRef = React.createRef()
    this.state = {
      number: 0
    }
  }

  setNumber = () => {
    debugger
    this.setState({number: this.state.number + 1})
    console.log(this.state)
    this.setState({number: this.state.number + 1})
    console.log(this.state)
    this.setState({ number: this.state.number + 1 })
    setTimeout(() => {
    this.setState({ number: this.state.number + 1 })
    console.log(this.state)
    this.setState({ number: this.state.number + 1 })
    console.log(this.state)
    }, 0);
  }

  inputClassFocus = () => {
    console.log(this.inputFunctionRef.current);
    this.inputFunctionRef.current.focus()
    // 通过ref 获取类组件 是获取类组件的实例
    // this.inputClassRef.current.inputFocus()
  }
  render() {
    return (
      <h2 onClick={() => console.log('测试事件冒泡')}>
        <div>{this.state.number}</div>
        <button onClick={this.setNumber}>+</button>
        {/* 类组件 */}
        {/* <ClassInput ref={this.inputClassRef} /> */}
        <ForwardFunctionInput ref={this.inputFunctionRef} />
        <button onClick={this.inputClassFocus}>聚焦处理</button>
      </h2>
    )
  }
}

ReactDom.render(<ClassElement name="react" />, document.getElementById('root'))
// React.createElement

/**
 * 1. 实现 createElement 返回一个 react 元素
 * 2. 实现 render 方法, 把 react 元素变成 真实DOM 元素插入root 里面
 * 
 {
  "type": "h2",
  "key": null,
  "ref": null,
  "props": {
    "children": [
      "hello ",
      {
        "type": "span",
        "key": null,
        "ref": null,
        "props": {
          "children": "reacr"
        }
      },
      " "
    ]
  },
}
 */
