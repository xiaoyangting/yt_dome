import React from 'react'
import ReactDom from 'react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

// 高阶组件
function withTracker(OldComponent) {
  return class extends React.Component {
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
          <OldComponent {...this.state} />
        </div>
      )
    }
  }
}
function welcome(props) {
  return (
    <span>y: {props.y};  x: {props.x}</span>
  )
}
const Tracker = withTracker(welcome)

ReactDom.render(<Tracker name="react" />, document.getElementById('root'))
