import { REACT_TEXT } from "./constants";

/**
 * 不关原来是什么样的元素, 都转成对象的形式, 方便后续的 dom-diff
 * @param {*} element 
 * @returns 
 */
 export function wrapToVdom(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return {
      type: REACT_TEXT,
      // 如果是文本节点 就把当前内容放到 props.content 里面
      props: { content: element }
    }
  } else {
    return element
  }
 }
