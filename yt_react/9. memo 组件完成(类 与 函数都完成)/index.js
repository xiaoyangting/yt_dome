import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'


// PureComponent 类函数. 作用在于性能优化, 在state 里面的值不改变的情况下 不会触发render( 相当于帮我们重新了 shouldComponentUpdate 判断了state 是否更新, 只做了浅比较 )
// class SubCounter extends React.PureComponent {
//   render() {
//     console.log('SubCounter');
//     return (
//       <div>
//         {this.props.number}
//       </div>
//     )
//   }
// }
function SubCounter (props) {
    console.log('SubCounter');
    return (
      <div>
        {props.number}
      </div>
    )
}
const MemoSubCounter = React.memo(SubCounter)

// PureComponent 类函数. 作用在于性能优化, 在state 里面的值不改变的情况下 不会触发render( 相当于帮我们重新了 shouldComponentUpdate 判断了state 是否更新, 只做了浅比较 )
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }
  inputRef = React.createRef()
  add = () => {
    this.setState({
      number: this.state.number + Number(this.inputRef.current.value)
    })
  }
  render() {
    console.log('Counter');
    return (
      <div>
        {
          this.state.number
        }
        <input type="text" ref={this.inputRef} />
        <button onClick={this.add}>+</button>
        <MemoSubCounter number={this.state.number} />
      </div>
    )
  }
}


ReactDom.render(<Counter />, document.getElementById('root')
)
