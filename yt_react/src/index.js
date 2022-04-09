import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

// 创建context = { Provider, Consumer }
const ThemeContext = React.createContext()

function ChildClassEle(params) {
  
  return (
    // Consumer 通过通过调用函数组件 传入 Provider._value 的值进来 获取到 context
    <ThemeContext.Consumer>
      {
        (value) => (
          <div style={{
            margin: '10px', padding: '10px', border: `2px solid ${value.color}`}}>
            子组件
            <SunClassEle/>
          </div>
        )
      }
    </ThemeContext.Consumer>
  )
}
// class ChildClassEle extends React.Component {
//   // 如果需要拿到 ThemeContext 的value 属性的话, 需要在类组件里面加这个 contextType 静态属性, 那么就可以通过 this.context 来获取那个value 值
//   static contextType = ThemeContext
//   render() {
//     console.log(1);
//     return (
//       <div style={{
//         margin: '10px', padding: '10px', border: `2px solid ${this.context.color}`}}>
//         子组件
//         <SunClassEle/>
//       </div>
//     )
//   }
// }
class SunClassEle extends React.Component {
  // 如果需要拿到 ThemeContext 的value 属性的话, 需要在类组件里面加这个 contextType 静态属性, 那么就可以通过 this.context 来获取那个value 值
  static contextType = ThemeContext
  render() {
    return (
      <div style={{
        margin: '10px', padding: '10px', border: `2px solid ${this.context.color}`}}>
        孙组件
        <button onClick={() => this.context.changeColor('red')}>红色</button>
        <button onClick={() => this.context.changeColor('pink')}>粉色</button>
      </div>
    )
  }
}
class ClassElement extends React.Component {
  constructor(props) {
    super(props)
    this.state = { color: 'pink' }
  }
  changeColor = (color) => {
    this.setState({color})
  }
  render() {
    let value = { color: this.state.color, changeColor: this.changeColor }
    return (
      // 只要给 provider 传递 value属性, 那么下层所有的组件都会拿到这个value 属性
      <ThemeContext.Provider value={value}>
        <div style={{
          margin: '10px', padding: '10px', border: `2px solid ${this.state.color}`, width: '300px' }}>
          父组件
          <ChildClassEle />
        </div>
      </ThemeContext.Provider>
    )
  }
}

ReactDom.render(<ClassElement name="react" />, document.getElementById('root'))
