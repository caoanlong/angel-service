const Router = require('koa-router')
const router = new Router({prefix: '/sysUser'})
const SysUserController = require('../../controller/SysUserController')

/* 获取用户列表 */
router.get('/list', new SysUserController().findList())

/* 获取用户详情 */
router.get('/info', new SysUserController().findById())

/* 添加用户 */
router.post('/add', new SysUserController().create())

/* 修改用户 */
router.post('/update', new SysUserController().update())

/* 删除用户 */
router.post('/delete', new SysUserController().del())

/* 获取用户权限菜单 */
router.get('/findMenuList', new SysUserController().findMenuList())

module.exports = router