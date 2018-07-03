const Router = require('koa-router')
const router = new Router({prefix: '/sysRole'})
const SysRoleController = require('../controller/SysRoleController')

/* 获取角色列表 */
router.get('/list', SysRoleController.findList())

/* 获取角色详情 */
router.get('/info', SysRoleController.findById())

/* 添加角色 */
router.post('/add', SysRoleController.create())

/* 修改角色 */
router.post('/update', SysRoleController.update())

/* 删除角色 */
router.post('/delete', SysRoleController.del())

/* 修改角色权限菜单 */
router.post('/update/menu', SysRoleController.updateMenu())

module.exports = router