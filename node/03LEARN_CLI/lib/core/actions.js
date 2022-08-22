const { promisify } = require('util'); // promisify 将回调转为 promise
const path = require('path')

// 克隆项目的库
const download = promisify(require('download-git-repo'))
const open = require('open')

// vue 的 git模板地址
const { vueRepo } = require('../config/repo-config')
// 执行终端命令
const { commandSpawn } = require('../utils/terminal')
const { compile, writeToFile } = require('../utils/utils')

const createProjectAction = async (project) => {
  console.log('create', project);
  // 1. clone 项目
  const res = await download(vueRepo, project, { clone: true })
  console.log('模板拉取完成');
  // console.log('测试', res);
  // download(vueRepo, project, { clone: true }).then(res => {
  //   console.log(res);
  // })

  // 2. 执行npm install
  // 因为在 window 系统上, npm 执行的是 npm.cmd 所以我们需要判断一下操作系统
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  await commandSpawn(command, ['install'], { cwd: `./${project}` })
  console.log('初始化完成');

  // 3. 运行npm run serve
  commandSpawn(command, ['run', 'serve'], { cwd: `./${project}` })
  console.log('项目运行完成');

  // 4. 打开浏览器
  open('http://localhost:8080/')
}

const addCpnAction = async (name, dest) => {
  // 1. 有对应的ejs 模板
  // 2. 编译 ejs 模板 result
  const res = await compile('component.ejs', { data: { name, lowerName: name.toLowerCase() } })
  console.log(res);
  // 3. 在对应的文件夹中将对应的result 写入到 .vue文件中 
  const targetPath = path.resolve(`${dest}/${name}.vue`)
  console.log(targetPath);
  writeToFile(targetPath, res)
}

module.exports = {
  createProjectAction,
  addCpnAction
}
