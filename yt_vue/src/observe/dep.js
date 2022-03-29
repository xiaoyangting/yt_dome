let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = [] // 这里存储着当前属性对应的watcher, (因为可能一个属性对应多个组价, 所以watcher 也会是多个)
  }

  // 交叉记录
  depend() { // 调用watcher 记录dep
    // 这里我们不希望放重复的watcher, 在addDep 这个方法里面, 已经加了一层拦截, 所以不会有重复的 dep watcher
    Dep.target.addDep(this)
    // dep 和 watcher 是一个多对多得关系 ( 一个属性可以再多个组件中使用 dep -> 多个watch  )
    // 一个组件中由多个属性组成 (  一个watcher 对应多个 dep )
  }
  // 在watcher.addDep 里面会有一个回调, 调用dep 里面的 addsub
  addSub(watch) {
    this.subs.push(watch)
  }

  // 调用dep 里面的watcher 来循环更新
  notify() {
    this.subs.forEach(watcher => watcher.update(watcher))
  }

}

// 该属性是 Dep 的原型链上的属性, 全局唯一性, 为的就是在Dep里面存储 watcher, 然后再利用 watcher 方法存储 Dep
Dep.target = null

export default Dep
