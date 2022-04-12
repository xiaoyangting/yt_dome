import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

class MouseTracker extends React.Component {
    constructor(props) {
      super(props)
      this.state = { y: '', x: '' }
    }
    getMouseMove = (e) => {
      this.setState({y: e.clientY, x: e.clientX})
    }
    render() {
      return (
        <div
          style={{width: '100%', height: '100%'}}
          onMouseMove={this.getMouseMove}
        >
          {
            this.props.render(this.state)
          }
        </div>
      )
    }
  }


ReactDom.render(
  // 往组件嵌套函数, 传入数据共享值 children
  // <MouseTracker>
  //   {
  //     props => (
  //       <span>y: {props.y};  x: {props.x}</span>
  //     )
  //   }
  // </MouseTracker>,

  
  // 往组件传入渲染函数, 调用render
  <MouseTracker render={
    props => (
            <span>y: {props.y};  x: {props.x}</span>
          )
  } />,
  document.getElementById('root')
)
