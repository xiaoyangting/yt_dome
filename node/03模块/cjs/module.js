/*
   commonjs exports 出去的是一个对象
   而module.exports 最终也会和 exports 这个对象合并, 但是这个合并的话是以 module.exports 为准, 如合并出现的一样的key值, 那么就会以 module.exports 为先
*/


const name = '肖杨挺';
const age = 23
module.exports = {
  name,
  age
}
exports.name = 'xyt'


