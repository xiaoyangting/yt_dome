// 解析字符串 的正则
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>

// 生成 ast 树
export function parseHTML(html) { // HTML 最开始肯定是一个 <div id="app">内容</div>
  const ELEMENT_TYPE = 1; // dom 元素类型
  const TEXT_TYPE = 3; // text 文本类型
  const stack = [] // 用于存储元素的
  let currentParent = null // 指向栈中的最后一个( 当前元素 )
  let root = null // ast树

  function createASTElement(tag, attrs) {
    return {
      tag, // 标签名称
      type: ELEMENT_TYPE, // 当前的类型
      children: [], // 子元素的数组
      attrs, // 该标签的属性数组
      parent: null, // 当前元素的父级元素
    }
  }

  // 开始标签
  // 利用栈型结构 构造出一课 ast 树
  function start(tagName, attrs) {
    let node = createASTElement(tagName, attrs)
    if (!root) { // 判断是否是空树
      root = node // 如果为空则说明当前的元素是树的根节点
    }

    if (currentParent) { // 判断栈中最后的元素是否存在
      node.parent = currentParent // 当前元素中的父级元素就是 栈中的最后一个元素 ( 因为当前的元素还没进栈 )
      currentParent.children.push(node) // 还需要把栈中最后一个元素的 子元素数组记录 当前元素
    }

    // 把栈中的最后一个元素记录完成之后, 我们就可以开始把当前元素追加到栈中 成为栈中最后的元素了
    stack.push(node)
    currentParent = node // currentParent 栈中的最后一个元素
  }
  // 文本内容
  function chars(text) { // 文本直接放到当前指向的节点终
    text = text.replace(/\s/g, ' ') // 如果当前文本空格超过2个以上就替换成一个
    // 把当前内容追加到 栈中的最后一个的子元素数组中 ( children ), 类型为 3
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }

  function end(tag) {
    let node = stack.pop() // 如果走到end这个标签, 则说明已经遇到闭标签, 这个时候就可以把栈中最后一个弹出来了, 并且校验标签是否合法
    if (node.tag == tag) {
      currentParent = stack[stack.length - 1]
    } else {
      throw new Error('当前标签闭合有误')
    }

  }

  // 前进字符串 ( 去除已解析的字符串 )
  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    // 解析开始标签
    const start = html.match(startTagOpen)
    // 判断是否有开始标签
    if (start) {
      // 组合虚拟dom
      const match = {
        tagName: start[1], // 标签名
        attrs: [], // 该标签的属性值等
      }
      // 前进字符
      advance(start[0].length)

      // 如果不是开始标签 就一直匹配下去 直至把 > 匹配到
      let attr, end // attr当前属性变量  end 开始标签的 闭字符
      while ( !(end = html.match(startTagClose)) && (attr = html.match(attribute)) ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }

      if (end) {
        advance(end[0].length)
      }
      return match // 返回开始标签
    }
    return false // 不是开始标签
  }
  while (html) {
    // 如果textEnd 为 0 说明是一个开始标签 或者 结束标签
    // 如果textEnd > 0 说明就是文本的结束位置
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const startTagMatch = parseStartTag() // 开始标签的匹配结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 匹配结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd) // 内容 {{ name }}</div>  拿到的值是这个 现在进行切割
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }

  return root
}