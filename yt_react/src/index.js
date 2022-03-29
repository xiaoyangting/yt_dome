// import React from './react'
import ReactDom from './react-dom'
import React, {component} from 'react'
// import ReactDom from 'react-dom'

let element = <h2 style={{background: 'pink'}}>hello <span>reacr</span> </h2>
let element2 = React.createElement("h2", {
  style: {
    background: 'pink'
  },
  // dataName: 'xyt'
}, "hello ", React.createElement("span", null, "reacr"));

// console.log(JSON.stringify(element, null, 2));
// console.log(JSON.stringify(element2, null, 2));

function Element(props) {
  return (
    <h2>hello <span>{props.name}</span></h2>
  )

  // 这个是旧jax 编译出来的虚拟DOM数据结构, 修改下面的命令转换成旧的编译
  // "start": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts start",
  // "build": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts build",
  // "test": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts test",
  // "eject": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts eject"

  return  React.createElement("h2", {
      style: {
        background: 'pink'
      },
      dataName: 'xyt'
    }, "hello ", React.createElement("span", null, props.name), " ");
}
console.log(<Element name="react" />);
ReactDom.render(<Element name="react" />, document.getElementById('root'))
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
