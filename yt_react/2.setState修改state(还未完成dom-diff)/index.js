import React from './react'
import ReactDom from './react-dom'
// import React, {component} from 'react'
// import ReactDom from 'react-dom'

// let element = <h2 style={{background: 'pink'}}>hello <span>reacr</span> </h2>
// let element2 = React.createElement("h2", {
//   style: {
//     background: 'pink'
//   },
//   // dataName: 'xyt'
// }, "hello ", React.createElement("span", null, "reacr"));
// console.log(JSON.stringify(element, null, 2));
// console.log(JSON.stringify(element2, null, 2));

// 函数组件加载
// function Element(props) {
//   return (
//     <h2>hello <span>{props.name}</span></h2>
//   )

//   // 这个是旧jax 编译出来的虚拟DOM数据结构, 修改下面的命令转换成旧的编译 window 电脑使用 set  mac 使用 export
//   // "start": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts start",
//   // "build": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts build",
//   // "test": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts test",
//   // "eject": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts eject"
//   // return  React.createElement("h2", {
//   //     style: {
//   //       background: 'pink'
//   //     },
//   //     dataName: 'xyt'
//   //   }, "hello ", React.createElement("span", null, props.name), " ");
// }

/*
类组件加载 
  组件分为内置原生组件 和 自定义组件
  内置组件 p h1 span div等
  自定义组件的名称必须是大写字母开头
  自定义组件的返回值有且只能是一个根元素

  自定义组件 类型是一个函数, 类组件的父类 Component 的原型上有一个属性 isReactCpmponent={}, 就是用这个属性来判断是 类组件还是 函数组件的
*/
class ClassElement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name
    }
  }

  setName = () => {
    debugger
    this.setState({
      name: '肖杨挺'
    }, (state) => {
      console.log('cb', state)
    })
    console.log(this.state)
  }

  render() {
    return (
      <h2>hello
        {/* <span onClick={this.setName}> {this.state.name}</span> */}
        <FunctioElement name={this.state.name} setName={this.setName} />
      </h2>
    )
  }
}

function FunctioElement(props) {
  return <span onClick={props.setName}> {props.name}</span>
}
// console.log(<Element name="react" />);
// console.log(<ClassElement name="react" />);
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
