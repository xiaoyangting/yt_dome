import { observe } from "./observe/index"

export function initState(vm) {
  const opts = vm.$options // 回去Vue 所有的选项
  if (opts.data) { // 判断是否有data, 如果有的再去初始化 代理 和 监听data里面的数据
    initData(vm)
  }
}

function proxy(vm, _data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[_data][key]
    },
    set(newV) {
      vm[_data][key] = newV
    }
  })
}

function initData(vm) {
  var data = vm.$options.data // data 可能也有可能是函数
  // 判断是否是函数, 如果是的话 就调用(默认会返回对象的), 再把该函数的this 指向 vm(也就是vue)
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  // 对数据继续劫持 vue 里采用的是 object definePropety api 来对对象里面的每一个属性进行代理的 而不是对整个对象
  observe(data)

  // 数据代理( 使之可以直接使用 this 的实例访问 )
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      proxy(vm, '_data', key)
    }
  }
}