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
            this.props.render && this.props.render(this.state)
          }
        </div>
      )
    }
  }


ReactDom.render(<MouseTracker />, document.getElementById('root')
)
