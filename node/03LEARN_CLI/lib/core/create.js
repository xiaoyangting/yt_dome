const program = require('commander')

const { createProjectAction, addCpnAction } = require('./actions') 

const create = () => {
  program
    .command('create <project>')
    .description('克隆项目模板, 创建项目')
    .action(createProjectAction)
  
  program
    .command('addcpm <name>')
    .description('创建组件模板')
    .action((name) => {
      addCpnAction(name, program.opts().dest || 'src/components')
    })
}

module.exports = create
