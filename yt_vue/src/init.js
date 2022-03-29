import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./initLifeCycle";
import { initState } from "./state";

export function initMxin(vue) {
  vue.prototype._init = function (options) { // 就是给Vue 增加 _init 方法的
    const vm = this
    vm.$options = options

    // 1. 初始化状态
    //     a. 数据监听
    initState(vm)

    // 2. 生成虚拟dom
    if (options.el) {
      vm.$mount(options.el)
    }
  }
  
  vue.prototype.$mount = function (el) {
    const vm = this
    // 获取dom元素
    el = document.querySelector(el)
    let opt = vm.$options
    // 1 先判断有没有render函数
    if (!opt.render) {
      // 2 如果没有render函数的情况下, 再进行判断是否有template, 如果也没有的情况下 就 使用外部template 
      let template
      if (!opt.template && el) {
        template = el.outerHTML
      } else {
        if (el) {
          template = opt.template // 如果有el 则采用模板内容
        }
      }
      if (template && el) {
        // 对模板进行编译
        const render = compileToFunction(template)
        // console.log(render);
        opt.render = render // jsx 最终会编译成 h('xxx')
      }
      // console.log(opt);

      mountComponent(vm, el)
    }
  }
}