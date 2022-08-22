// 需要主要的是 es6的 模块引入 可以再node里面使用, 但是node里面的request 不能够再es6里面使用,  而想webpage 那些打包工具实际上是内部本身自定义的
import obj, { name } from './mpdule.js'

console.log(name)
console.log(obj);
