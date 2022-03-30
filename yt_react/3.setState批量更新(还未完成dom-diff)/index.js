import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'
class ClassElement extends React.Component {
  constructor(props) {
    super(props)
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

  render() {
    return (
      <h2 onClick={() => console.log('测试事件冒泡')}>
        <div>{this.state.number}</div>
        <button onClick={this.setNumber}>+</button>
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
