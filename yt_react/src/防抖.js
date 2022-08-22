import React, { Component, useEffect, useCallback, useRef } from 'react'
import ReactDom from 'react-dom'
const data = [
  { name: "html5" },
  { name: "html5 下载" },
  { name: "javaSciprt" },
  { name: "java" },
  { name: "c++" },
  { name: "golang" },
  { name: "php" }
];

// 防抖 hooks
function useDebounce(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);
  return useCallback(function f(...args) {
    console.log(current.timer);
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep)
}

const SearchInput = () => {
  const [search, setSearch] = React.useState('')
  const [searchList, setSearchList] = React.useState([])

  const debouncedChange = (val) => {
    // 不明白您这个说需要用到 promise 是什么意思, 如果是指在请求的时候的话 在下面使用就OK
    // 如果是 delayedQuery 这个返回上使用promise的话 在useDebounce 这个防抖事件上包装一层promise 就OK了
    setSearchList(data.filter((item) => {
      if (item.name.indexOf(val) >= 0) {
        return item
      }
    }))
  }
  const delayedQuery = useDebounce(q => debouncedChange(q), 1000);
  const onChange = event => {
    const val = event.target.value
    setSearch(val)
    delayedQuery(val);
  };


  return <div className="App">
    <input value={search} onChange={onChange} placeholder="请输入搜索内容" />
    <List list={searchList}></List>
  </div>;
}


const List = ({ list }) => {
  return (
    <div>
      {
        list.map(item => <ListItem key={item.name} item={item} />)
      }
    </div>
  )
}
const ListItem = ({ item }) => {
  return (
    <div>{item.name}</div>
  )
}
ReactDom.render(<SearchInput />, document.getElementById('root'))