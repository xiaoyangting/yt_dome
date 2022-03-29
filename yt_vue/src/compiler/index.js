import { parseHTML } from "./parse";

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
// console.log(defaultTagRE.exec('{{name}} nihao ya '));

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      });
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  // console.log(str.slice(0, -1));
  return `{${str.slice(0, -1)}}` // 去除尾部的 , 
}

function gen(node) {
  if (node.type === 1) { // 如果是dom元素的话, 需要递归转换代码
    return codegen(node)
  } else if (node.type === 3) { // 文本
    let text = node.text
    if (!defaultTagRE.test(text)) { // 取反 获取纯文本( 就是没有该文本没有 {{ 这些 }} )
      return `_v(${JSON.stringify(text)})`
    } else {
      let tokens = []
      let match = null
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      // 匹配 字符串中所有的 {{}}
      while (match = defaultTagRE.exec(text)) {
        // exec 里面有一个index 属性, 第一次匹配他会匹配到第一个符合条件的字符串, 
        // 第二次匹配的话, 他会跳过第一个符合条件的字符串, 以此类推, 可以把它的匹配当成一个前进字符
        // console.log(match);
        let index = match.index // 匹配到 {{}} 的位置
        if (index > lastIndex) {
          // 如果index 大于 lastIndex 的话, 就说明 {{变量}} 是在正常字符串的后面, 
          // 那么我们就需要把到 index 之前的字符串截取出来
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        // 上面已经把 {{}} 之前的正常字符串截取出来了, 那么后面就可以把变量也追加进去了
        tokens.push(`_s(${match[1].trim()})`)
        // 把当前的字符串索引请进到 {{}} 之后, 提供下次再一次请进
        lastIndex = index + match[0].length
      }
      // console.log(tokens);
      return `_v(${tokens.join('+')})`
    }

  }
}

function genChildren(children) {
  return children.map(child => gen(child)).join(',')
}
// 生成代码
function codegen(ast) {
  let children = genChildren(ast.children)
  // 递归 每一层都转义成方法结构
  let code = (`_c('${ast.tag}', ${ast.attrs.length > 0 ? genProps(ast.attrs) : null} ${ast.children.length ? `,${children}` : ''})`)
  return code
}

export function compileToFunction(template) {
  // 1. 将 template 转化成 ast 语法树
  let ast = parseHTML(template)
  // console.log(ast)

  // 2. 生成 render 方法 ( render方法执行后的返回的结果就是 虚拟dom )
  // 模板引擎的实现原理 就是 with ( 将当前的this 指向更改 ) + new Function ( 字符串转代码返回 )
  let code = codegen(ast)
  code = `with(this){ return ${code} }`
  let render = new Function(code) // 根据代码字符串 利用 Function 来生成代码
  // console.log(code);
  return render
}