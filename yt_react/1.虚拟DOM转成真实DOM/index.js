import React from './react'
import ReactDom from './react-dom'
// import ReactDom from 'react-dom'

// let element = <h2>hello <span>reacr</span> </h2>
let element = React.createElement("h2", {
  style: {
    background: 'pink'
  },
  dataName: 'xyt'
}, "hello ", React.createElement("span", null, "reacr"), " ");
console.log(JSON.stringify(element, null, 2));
ReactDom.render(element, document.getElementById('root'))
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
