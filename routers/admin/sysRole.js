const Router = require('koa-router')
const router = new Router({prefix: '/sysRole'})
const SysRoleController = require('../../controller/SysRoleController')

/* 获取角色列表 */
router.get('/list', new SysRoleController().findList())

/* 获取角色详情 */
router.get('/info', new SysRoleController().findById())

/* 添加角色 */
router.post('/add', new SysRoleController().create())

/* 修改角色 */
router.post('/update', new SysRoleController().update())

/* 删除角色 */
router.post('/delete', new SysRoleController().del())

/* 获取角色权限列表 */
router.get('/findMenuList', new SysRoleController().findMenuList())

/* 修改角色权限菜单 */
router.post('/addAuthority', new SysRoleController().addAuthority())

module.exports = router