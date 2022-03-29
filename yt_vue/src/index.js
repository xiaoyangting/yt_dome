import { initMxin } from "./init";
import { initLifeCycle } from "./initLifeCycle";
import { nextTick } from "./observe/watcher";

export default function Vue(options) { // options 是用户配置
  this._init(options) // 默认调用初始化函数
}
Vue.prototype.$nextTick = nextTick
initMxin(Vue)
initLifeCycle(Vue)